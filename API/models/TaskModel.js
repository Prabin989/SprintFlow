const db = require('../database/connection');

class TaskModel {
    static getAll(filters = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM tasks';
            const params = [];
            const conditions = [];

            if (filters.status) {
                conditions.push('status = ?');
                params.push(filters.status);
            }
            if (filters.priority) {
                conditions.push('priority = ?');
                params.push(filters.priority);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            const createdAt = new Date().toISOString();
            const { title, description, status = 'todo', priority = 'medium', dueDate, categoryId } = data;

            const stmt = db.prepare(`
        INSERT INTO tasks (title, description, status, priority, dueDate, categoryId, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

            stmt.run([title, description, status, priority, dueDate, categoryId, createdAt], function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...data, createdAt });
            });
            stmt.finalize();
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            const updatedAt = new Date().toISOString();
            const { title, description, status, priority, dueDate, categoryId } = data;

            db.run(
                `UPDATE tasks 
         SET title = COALESCE(?, title), 
             description = COALESCE(?, description), 
             status = COALESCE(?, status), 
             priority = COALESCE(?, priority),
             dueDate = COALESCE(?, dueDate),
             categoryId = COALESCE(?, categoryId),
             updatedAt = ?
         WHERE id = ?`,
                [title, description, status, priority, dueDate, categoryId, updatedAt, id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }
}

module.exports = TaskModel;
