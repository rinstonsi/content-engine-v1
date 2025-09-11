import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import application layer
import { UserServiceImpl } from '../../../application/use-cases/UserServiceImpl.js';

// Import adapters
import { InMemoryUserRepository } from '../../outbound/repositories/InMemoryUserRepository.js';
import { UserController } from './UserController.js';
import { createUserRoutes } from './routes/userRoutes.js';
import { config } from '../../../shared/config/index.js';
import { MultisportProvider } from '../../outbound/external-services/multisport/MultisportProvider.js';
import { GetFixtures } from '../../../application/use-cases/GetFixtures.js';
import { PageDataController } from './PageDataController.js';
import { createPageDataRoutes } from './routes/pageDataRoutes.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.warn(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Dependency injection setup
const userRepository = new InMemoryUserRepository();
const userService = new UserServiceImpl(userRepository);
const userController = new UserController(userService);

// Multisport provider wiring
const multisportProvider = new MultisportProvider({
  baseUrl: config.providers.multisport.baseUrl,
  clientId: config.providers.multisport.clientId,
  defaultTz: config.providers.multisport.defaultTz,
  timeoutMs: config.providers.multisport.timeoutMs,
});
const fixtureService = new GetFixtures(multisportProvider);
const pageDataController = new PageDataController({ fixtureService });

// Routes
app.use('/api/users', createUserRoutes(userController));
app.use('/', createPageDataRoutes(pageDataController));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hexagonal Architecture Node.js API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      pageData: '/content-engine/v1/page-data',
      health: '/health',
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, _next) => {
  console.warn('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(NODE_ENV === 'development' && { details: error.message }),
  });
});

// Start server
if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.warn(`🚀 Server running on port ${PORT}`);
    console.warn(`📱 Environment: ${NODE_ENV}`);
    console.warn(`🔗 Health check: http://localhost:${PORT}/health`);
    console.warn(`👥 Users API: http://localhost:${PORT}/api/users`);
  });
}

export default app;
