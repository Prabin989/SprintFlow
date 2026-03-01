const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

/**
 * @api {get} /tasks Get all tasks
 * @apiName GetTasks
 * @apiGroup Tasks
 *
 * @apiSuccess {Object[]} tasks List of tasks.
 * @apiSuccess {Number} tasks.id Task ID.
 * @apiSuccess {String} tasks.title Task title.
 * @apiSuccess {String} tasks.description Task description.
 * @apiSuccess {String} tasks.status Task status (pending, in-progress, completed).
 * @apiSuccess {String} tasks.due_date Task due date.
 */
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ tasks: rows });
    });
});

/**
 * @api {get} /tasks/:id Get task by ID
 * @apiName GetTask
 * @apiGroup Tasks
 *
 * @apiParam {Number} id Task unique ID.
 *
 * @apiSuccess {Object} task Task details.
 * @apiSuccess {Number} task.id Task ID.
 * @apiSuccess {String} task.title Task title.
 * @apiSuccess {String} task.description Task description.
 * @apiSuccess {String} task.status Task status.
 * @apiSuccess {String} task.due_date Task due date.
 * 
 * @apiError TaskNotFound The id of the Task was not found.
 */
app.get('/tasks/:id', (req, res) => {
    db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ task: row });
    });
});

/**
 * @api {post} /tasks Create a new task
 * @apiName CreateTask
 * @apiGroup Tasks
 *
 * @apiBody {String} title Task title (required).
 * @apiBody {String} [description] Task description.
 * @apiBody {String} [status="pending"] Task status (pending, in-progress, completed).
 * @apiBody {String} [due_date] Task due date.
 *
 * @apiSuccess {Number} id Processed task ID.
 * @apiSuccess {String} message Success message.
 */
app.post('/tasks', (req, res) => {
    const { title, description, status, due_date } = req.body;

    if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    const stmt = db.prepare('INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)');
    stmt.run([title, description, status || 'pending', due_date], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            message: 'Task created successfully',
            id: this.lastID
        });
    });
    stmt.finalize();
});

/**
 * @api {put} /tasks/:id Update an existing task
 * @apiName UpdateTask
 * @apiGroup Tasks
 *
 * @apiParam {Number} id Task unique ID.
 *
 * @apiBody {String} title Task title.
 * @apiBody {String} description Task description.
 * @apiBody {String} status Task status.
 * @apiBody {String} due_date Task due date.
 *
 * @apiSuccess {String} message Success message.
 */
app.put('/tasks/:id', (req, res) => {
    const { title, description, status, due_date } = req.body;
    const id = req.params.id;

    db.run(
        'UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status), due_date = COALESCE(?, due_date) WHERE id = ?',
        [title, description, status, due_date, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.json({ message: 'Task updated successfully' });
        }
    );
});

/**
 * @api {delete} /tasks/:id Delete a task
 * @apiName DeleteTask
 * @apiGroup Tasks
 *
 * @apiParam {Number} id Task unique ID.
 *
 * @apiSuccess {String} message Success message.
 */
app.delete('/tasks/:id', (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
