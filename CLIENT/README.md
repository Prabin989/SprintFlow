# SprintFlow - Client Application

This is the React frontend for the SprintFlow Task Management System, built with **Vite** and **React Router DOM**.

## Features
- **Dashboard:** At-a-glance statistics and urgent high-priority tasks.
- **Task Management:** Full CRUD capabilities with robust filtering by status and priority.
- **Category Workspaces:** Custom color-coded categories to organize tasks.
- **Modern UI:** Built using a custom scalable CSS framework and React Icons.

## Prerequisites

Ensure the Node.js API (backend) is running before starting the client:

```bash
# In a separate terminal
cd ../API
npm install
npm start
```
*(The API runs on port 3000)*

## Getting Started

1. Install frontend dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL provided by Vite (typically http://localhost:5173).

## Testing

This project includes E2E browser tests written with `testcafe`. 
To run the browser tests:

```bash
npx testcafe chrome tests/app.test.js
```
*(Ensure both the API and the React Client are running before running the tests!)*
