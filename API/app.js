const express = require('express');
const cors = require('cors');

const categoryRoutes = require('./routes/categoryRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);

// Root fallback
app.get('/', (req, res) => {
    res.json({ message: 'Task Management System API is running.' });
});

module.exports = app;
