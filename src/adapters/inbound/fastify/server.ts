import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import dotenv from 'dotenv';

// Reuse existing JS application layer and adapters
import { UserServiceImpl } from '../../../application/use-cases/UserServiceImpl.js';
import { InMemoryUserRepository } from '../../outbound/repositories/InMemoryUserRepository.js';
import { UserController } from '../rest/UserController.js';
import { config } from '../../../shared/config/index.js';
import { MultisportProvider } from '../../outbound/external-services/multisport/MultisportProvider.js';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || 'development';

export async function buildServer() {
  const app = Fastify({ logger: NODE_ENV !== 'test' });

  await app.register(fastifyHelmet);
  await app.register(fastifyCors, { origin: true });

  // Simple request logging
  app.addHook('onRequest', async (req) => {
    app.log.info({ method: req.method, url: req.url }, 'incoming');
  });

  // Dependencies
  const userRepository = new InMemoryUserRepository();
  const userService = new UserServiceImpl(userRepository);
  const userController = new UserController(userService);

  const multisportProvider = new MultisportProvider({
    baseUrl: config.providers.multisport.baseUrl,
    clientId: config.providers.multisport.clientId,
    defaultTz: config.providers.multisport.defaultTz,
    timeoutMs: config.providers.multisport.timeoutMs,
  });

  // Express-like response shim for existing controllers
  function toExpressLikeRes(reply: any) {
    return {
      status(code: number) {
        return {
          json: (payload: unknown) => reply.code(code).send(payload),
        };
      },
      json(payload: unknown) {
        return reply.send(payload);
      },
      send(payload: unknown) {
        return reply.send(payload);
      },
    } as any;
  }

  // Routes: users
  app.post('/api/users', async (request, reply) => userController.createUser(request as any, toExpressLikeRes(reply)));
  app.get('/api/users', async (request, reply) => userController.getAllUsers(request as any, toExpressLikeRes(reply)));
  app.get('/api/users/:id', async (request, reply) => userController.getUserById(request as any, toExpressLikeRes(reply)));
  app.put('/api/users/:id', async (request, reply) => userController.updateUser(request as any, toExpressLikeRes(reply)));
  app.delete('/api/users/:id', async (request, reply) => userController.deleteUser(request as any, toExpressLikeRes(reply)));

  // Health
  app.get('/health', async () => ({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  }));

  // Root
  app.get('/', async () => ({
    message: 'Hexagonal Architecture Node.js API (Fastify)',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      health: '/health',
    },
  }));

  // 404
  app.setNotFoundHandler(async (request, reply) => {
    reply.code(404).send({ success: false, error: 'Endpoint not found', path: request.url });
  });

  // Error
  app.setErrorHandler(async (error, request, reply) => {
    app.log.error(error);
    reply.code(500).send({ success: false, error: 'Internal server error', ...(NODE_ENV === 'development' && { details: error.message }) });
  });

  return app;
}

if (NODE_ENV !== 'test') {
  buildServer()
    .then((app) => app.listen({ port: PORT, host: '0.0.0.0' }))
    .then((address) => {
      console.log(`🚀 Fastify server listening at ${address}`);
      console.log(`🔗 Health: http://localhost:${PORT}/health`);
    })
    .catch((err) => {
      console.error('Failed to start server', err);
      process.exit(1);
    });
}


