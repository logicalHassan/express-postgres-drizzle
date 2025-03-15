# Express TypeScript Boilerplate

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

## Overview

This is a well-structured boilerplate for building RESTful APIs using **Node.js**, **Express**, and **TypeScript** with **Drizzle ORM** and **PostgreSQL**. The project is designed for scalability, maintainability, and ease of contribution.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Drizzle ORM** - SQL query builder and ORM
- **PostgreSQL** - Relational database
- **Docker** (Optional) - Containerized environment
- **pnpm** - Fast, disk-efficient package manager

## Folder Structure

```plaintext
├── src/
│   ├── config/         # Application configuration
│   ├── controllers/    # Handles request-response logic
│   ├── middlewares/    # Express middlewares
│   ├── db/             # Database configuration & migrations
│   │   ├── migrations/ # Database migrations
│   │   ├── schema.ts   # Database schema using Drizzle ORM
│   ├── routes/         # API route definitions
│   │   ├── v1/         # Version 1 routes
│   │   ├── v2/         # Version 2 routes
│   ├── services/       # Business logic & reusable services
│   ├── utils/          # Utility functions & helpers
│   ├── types/          # Centralized types & interface
│   ├── validations/    # Schema validations
│   ├── app.ts          # Express app configuration
│   ├── index.ts        # Server entry point
│
├── .env.example        # Sample environment variables
├── package.json        # Dependencies & scripts
├── tsconfig.json       # TypeScript configuration
├── docker-compose.yml  # Docker setup for development
├── README.md           # Documentation
```

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Drizzle ORM](http://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

### Steps

1. Clone the repository:
   
   ```sh
   git clone https://github.com/logicalHassan/express-postgres-boilerpate.git
   cd express-postgres-boilerpate
   ```

2. Install dependencies:
   
   ```sh
   pnpm install
   ```

3. Configure environment variables:
   
   ```sh
   cp .env.example .env
   ```

4. Run database migrations:
   
   ```sh
   pnpm run db:generate
   ```


5. Apply database migrations:
   
   ```sh
   pnpm run db:push
   ```

6. Start the development server:
   
   ```sh
   pnpm run dev
   ```

## Available Scripts

| Command            | Description                                    |
|--------------------|------------------------------------------------|
| `pnpm run dev`    | Start development server with live reload       |
| `pnpm run build`  | Compile TypeScript files to JavaScript          |
| `pnpm start`      | Run the compiled JavaScript server              |
| `pnpm run lint`   | Lint TypeScript files using Biome.js            |
| `pnpm run db:generate`| Run Drizzle ORM database migrations         |
| `pnpm run db:push`| Apply Drizzle ORM database migrations           |
| `pnpm run db:sync`| Run & Apply migrations                          |
| `pnpm run db:reset`| Reset database migrations                      |
| `pnpm run db:studio`   | Start Drizzle Studio                       |
| `pnpm run db:seed`   | Seed database                                |
| `pnpm run test`   | Run unit tests                                  |

## Running with Docker

```sh
docker-compose up --build
```

This will spin up PostgreSQL and the application container.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes with meaningful messages.
4. Open a pull request.

## License

This project is licensed under the [MIT](LICENSE) License.
