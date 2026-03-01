const TaskModel = require('../models/TaskModel');

class TaskController {
    static async getAll(req, res) {
        try {
            // Optional Query Support
            const filters = {};
            if (req.query.status) filters.status = req.query.status;
            if (req.query.priority) filters.priority = req.query.priority;

            const tasks = await TaskModel.getAll(filters);
            res.json({ tasks });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getById(req, res) {
        try {
            const task = await TaskModel.getById(req.params.id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ task });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async create(req, res) {
        const { title, description, status, priority, dueDate, categoryId } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        try {
            const newTask = await TaskModel.create({ title, description, status, priority, dueDate, categoryId });
            res.status(201).json({ message: 'Task created successfully', task: newTask });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async update(req, res) {
        const { id } = req.params;

        try {
            const changes = await TaskModel.update(id, req.body);
            if (changes === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ message: 'Task updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async delete(req, res) {
        try {
            const changes = await TaskModel.delete(req.params.id);
            if (changes === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ message: 'Task deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = TaskController;
