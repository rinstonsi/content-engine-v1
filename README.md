# Hexagonal Architecture Node.js

A complete Node.js backend application built using Hexagonal Architecture (Ports and Adapters) principles. This project demonstrates clean architecture patterns, domain-driven design, and best practices for maintainable and testable code.

## 🏗️ Architecture Overview

This project follows the Hexagonal Architecture pattern, which separates the application into three main layers:

- **Core (Domain)**: Pure business logic with no external dependencies
- **Application**: Use cases and port definitions
- **Adapters**: External interfaces (REST API, database, etc.)

```
┌─────────────────────────────────────────────────────────────────┐
│                           ADAPTERS                              │
├─────────────────────┬───────────────────────┬───────────────────┤
│     INBOUND         │                       │     OUTBOUND      │
│                     │                       │                   │
│ ┌─────────────────┐ │                       │ ┌───────────────┐ │
│ │  REST API       │ │                       │ │  Repositories │ │
│ │  Controllers    │ │                       │ │               │ │
│ └─────────────────┘ │                       │ └───────────────┘ │
│ ┌─────────────────┐ │                       │ ┌───────────────┐ │
│ │  GraphQL        │ │    APPLICATION        │ │  External     │ │
│ │  Resolvers      │ │                       │ │  Services     │ │
│ └─────────────────┘ │  ┌─────────────────┐  │ └───────────────┘ │
│ ┌─────────────────┐ │  │   Use Cases     │  │ ┌───────────────┐ │
│ │  CLI            │ │  │                 │  │ │  Message      │ │
│ │  Commands       │ │  └─────────────────┘  │ │  Queues       │ │
│ └─────────────────┘ │  ┌─────────────────┐  │ └───────────────┘ │
│                     │  │   Ports         │  │                   │
│                     │  │ (Interfaces)    │  │                   │
│                     │  └─────────────────┘  │                   │
├─────────────────────┼───────────────────────┼───────────────────┤
│                     │        CORE           │                   │
│                     │                       │                   │
│                     │  ┌─────────────────┐  │                   │
│                     │  │   Entities      │  │                   │
│                     │  │                 │  │                   │
│                     │  └─────────────────┘  │                   │
│                     │  ┌─────────────────┐  │                   │
│                     │  │ Value Objects   │  │                   │
│                     │  │                 │  │                   │
│                     │  └─────────────────┘  │                   │
│                     │  ┌─────────────────┐  │                   │
│                     │  │ Domain Services │  │                   │
│                     │  │                 │  │                   │
│                     │  └─────────────────┘  │                   │
└─────────────────────┴───────────────────────┴───────────────────┘
```

## 📁 Project Structure

```
content-engine/
├── src/
│   ├── core/                          # Domain layer (business logic)
│   │   ├── entities/                  # Domain entities
│   │   │   └── User.js               # User entity
│   │   ├── value-objects/            # Value objects
│   │   │   └── Email.js              # Email value object
│   │   └── domain-services/          # Domain services
│   ├── application/                   # Application layer
│   │   ├── use-cases/                # Business use cases
│   │   │   ├── CreateUser.js         # Create user use case
│   │   │   ├── GetUser.js            # Get user use case
│   │   │   ├── UpdateUser.js         # Update user use case
│   │   │   ├── DeleteUser.js         # Delete user use case
│   │   │   └── UserServiceImpl.js    # User service implementation
│   │   └── ports/                    # Port definitions (interfaces)
│   │       ├── inbound/              # Inbound ports
│   │       │   └── UserService.js    # User service interface
│   │       └── outbound/             # Outbound ports
│   │           └── UserRepository.js # User repository interface
│   ├── adapters/                     # Adapter layer
│   │   ├── inbound/                  # Inbound adapters
│   │   │   ├── rest/                 # REST API adapter
│   │   │   │   ├── UserController.js # User REST controller
│   │   │   │   ├── routes/           # Route definitions
│   │   │   │   │   └── userRoutes.js # User routes
│   │   │   │   └── server.js         # Express server setup
│   │   │   ├── cli/                  # CLI adapter (future)
│   │   │   └── graphql/              # GraphQL adapter (future)
│   │   └── outbound/                 # Outbound adapters
│   │       ├── repositories/         # Repository implementations
│   │       │   └── InMemoryUserRepository.js
│   │       └── external-services/    # External service clients
│   └── shared/                       # Shared utilities
│       ├── config/                   # Configuration
│       │   └── index.js              # App configuration
│       ├── constants/                # Constants
│       │   └── index.js              # Application constants
│       ├── errors/                   # Error definitions
│       │   └── DomainError.js        # Domain error classes
│       └── utils/                    # Utility functions
│           └── validators.js         # Validation utilities
├── tests/                            # Test files
│   ├── unit/                         # Unit tests
│   │   ├── core/entities/            # Entity tests
│   │   │   └── User.test.js
│   │   └── application/use-cases/    # Use case tests
│   │       └── CreateUser.test.js
│   ├── integration/                  # Integration tests
│   │   └── UserController.test.js
│   └── e2e/                          # End-to-end tests
│       └── api.test.js
├── .husky/                           # Git hooks
│   ├── pre-commit                    # Pre-commit hook
│   └── commit-msg                    # Commit message hook
├── package.json                      # NPM configuration
├── .prettierrc                       # Prettier configuration
├── .prettierignore                   # Prettier ignore patterns
├── eslint.config.js                  # ESLint configuration
├── commitlint.config.js              # Commitlint configuration
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd content-engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Git hooks**
   ```bash
   npm run prepare
   ```

4. **Create environment file**
   ```bash
   # Create .env file from template
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` with hot reloading.

#### Production Mode
```bash
npm start
```

#### Environment Variables
Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (for future use)
DATABASE_URL=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hexagonal_app
DB_USERNAME=postgres
DB_PASSWORD=

# JWT Configuration (for future authentication)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=json

# CORS Configuration
CORS_ORIGIN=*
CORS_CREDENTIALS=false
```

## 🧪 Testing

This project includes comprehensive testing at all levels:

### Run All Tests
```bash
npm test
```

### Run Tests by Type
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# End-to-end tests only
npm run test:e2e

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

## 🔧 Development Tools

### Code Formatting
```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Linting
```bash
# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Git Hooks
The project uses Husky for Git hooks:
- **Pre-commit**: Runs Prettier and ESLint on staged files
- **Commit-msg**: Validates commit message format using Conventional Commits

### Conventional Commits
This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Examples of valid commit messages
git commit -m "feat: add user creation endpoint"
git commit -m "fix: handle duplicate email validation"
git commit -m "docs: update API documentation"
git commit -m "test: add integration tests for user controller"
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
```http
GET /health
```

### Users API

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### Get All Users
```http
GET /api/users
```

#### Get User by ID
```http
GET /api/users/{id}
```

#### Update User
```http
PUT /api/users/{id}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "name": "New Name"
}
```

#### Delete User
```http
DELETE /api/users/{id}
```

### Response Format
All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

## 🏗️ Architecture Principles

### Hexagonal Architecture Benefits

1. **Technology Independence**: Business logic is isolated from external concerns
2. **Testability**: Each layer can be tested in isolation
3. **Flexibility**: Easy to swap implementations (e.g., change from in-memory to PostgreSQL)
4. **Maintainability**: Clear separation of concerns
5. **Scalability**: Modular design supports growth

### Key Design Patterns

- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Interface Segregation**: Clients depend only on interfaces they use
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification

### Layer Responsibilities

#### Core (Domain Layer)
- Contains business entities, value objects, and domain services
- No dependencies on external frameworks or libraries
- Pure business logic and domain rules

#### Application Layer
- Orchestrates domain objects to perform application-specific tasks
- Contains use cases and port definitions (interfaces)
- Depends only on the domain layer

#### Adapter Layer
- Implements the ports defined in the application layer
- Handles external concerns (HTTP, database, file system, etc.)
- Converts external data formats to/from domain objects

## 🔄 Adding New Features

### Adding a New Entity

1. **Create the entity** in `src/core/entities/`
2. **Add repository interface** in `src/application/ports/outbound/`
3. **Create use cases** in `src/application/use-cases/`
4. **Implement repository** in `src/adapters/outbound/repositories/`
5. **Add REST controller** in `src/adapters/inbound/rest/`
6. **Write tests** for each layer

### Example: Adding a Product Entity

1. Create `src/core/entities/Product.js`
2. Create `src/application/ports/outbound/ProductRepository.js`
3. Create use cases: `CreateProduct.js`, `GetProduct.js`, etc.
4. Implement `src/adapters/outbound/repositories/InMemoryProductRepository.js`
5. Create `src/adapters/inbound/rest/ProductController.js`
6. Add routes in `src/adapters/inbound/rest/routes/productRoutes.js`
7. Write comprehensive tests

## 🛠️ Future Enhancements

### Planned Features
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Authentication and authorization (JWT)
- [ ] GraphQL API adapter
- [ ] CLI adapter
- [ ] Message queue integration
- [ ] Docker containerization
- [ ] API documentation with Swagger/OpenAPI
- [ ] Logging and monitoring
- [ ] Rate limiting
- [ ] Caching layer
- [ ] Background job processing

### Database Integration
To add database support:

1. Install database driver (e.g., `pg` for PostgreSQL)
2. Create database repository implementation
3. Update dependency injection in `server.js`
4. Add database migrations
5. Update configuration for database connection

## 📝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Write tests** for your changes
5. **Ensure all tests pass**
   ```bash
   npm test
   ```
6. **Commit your changes** (following Conventional Commits)
   ```bash
   git commit -m "feat: add amazing feature"
   ```
7. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Code Style Guidelines
- Follow the existing code style
- Use meaningful variable and function names
- Write comprehensive tests
- Add JSDoc comments for public APIs
- Follow SOLID principles
- Maintain layer boundaries

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) by Alistair Cockburn
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Robert C. Martin
- [Domain-Driven Design](https://domainlanguage.com/ddd/) by Eric Evans

## 📞 Support

For questions and support, please open an issue in the GitHub repository.

---

**Happy coding! 🚀**
