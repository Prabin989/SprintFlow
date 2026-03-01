const db = require('../database/connection');

class CategoryModel {
    static getAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM categories', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM categories WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static create(name, color) {
        return new Promise((resolve, reject) => {
            const createdAt = new Date().toISOString();
            const stmt = db.prepare('INSERT INTO categories (name, color, createdAt) VALUES (?, ?, ?)');
            stmt.run([name, color, createdAt], function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, name, color, createdAt });
            });
            stmt.finalize();
        });
    }

    static update(id, name, color) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE categories SET name = COALESCE(?, name), color = COALESCE(?, color) WHERE id = ?',
                [name, color, id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            // Because we set ON DELETE RESTRICT in the schema, this will automatically fail
            // if there are tasks tied to this category.
            db.run('DELETE FROM categories WHERE id = ?', [id], function (err) {
                if (err) {
                    if (err.message.includes('FOREIGN KEY constraint failed')) {
                        reject(new Error('Cannot delete category: Tasks are currently assigned to it.'));
                    } else {
                        reject(err);
                    }
                }
                else resolve(this.changes);
            });
        });
    }
}

module.exports = CategoryModel;
