# SprintFlow Task Management System

SprintFlow is a full-stack task management prototype developed as part of the Portfolio Task B2 assessment. This project demonstrates a robust REST API built with Node/Express and a modern reactive client application.

## Project Structure

- **API/**: Node.js/Express MVC backend with SQLite database integration.
- **CLIENT/**: React.js/Vite frontend application.
- **APIDOC/**: Generated static documentation for the REST API endpoints.

---

## Prerequisites

- **Node.js**: Version 20.10.0 LTS (or higher)
- **NPM**: Package manager included with Node.js

---

## Getting Started

### 1. Installation
Clone the repository and install all dependencies for both the API and Client.

```bash
# Install API dependencies
cd API
npm install

# Install Client dependencies
cd ../CLIENT
npm install
```

### 2. Database Setup
Initialize the SQLite database with realistic seed data (20+ records).

```bash
cd ../API
npm run seed
```

### 3. Running the Application
To run the full prototype, you need to start both the backend server and the frontend development server in separate terminal windows.

**Terminal A (API Server):**
```bash
cd API
npm start
```
*Runs on http://localhost:3000*

**Terminal B (Client App):**
```bash
cd CLIENT
npm run dev
```
*Runs on http://localhost:5173*

---

## Documentation & Testing

### API Documentation
To regenerate the documentation from current source comments:

```bash
cd API
npm run apidoc
```
The documentation is served from the `APIDOC/index.html` file.

### Running Tests
Both the backend and frontend include professional test suites.

**Backend API (Jest/Supertest):**
```bash
cd API
npm run test
```

**Frontend Client (TestCafe):**
*(Ensure both API and Client servers are running before starting UI tests)*
```bash
cd CLIENT
npm run test
```

---

## Built With

- **Backend**: Node.js, Express, SQLite3
- **Frontend**: React.js, Vite, React Router, React Icons
- **Testing**: Jest, Supertest, TestCafe
- **Documentation**: APIDoc
