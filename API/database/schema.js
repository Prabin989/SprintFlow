const db = require('./connection');

function initializeSchema() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create categories table
            db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          createdAt TEXT NOT NULL
        )
      `);

            // Create tasks table with foreign key to categories
            db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL CHECK(status IN ('todo', 'in-progress', 'done')) DEFAULT 'todo',
          priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
          dueDate TEXT,
          categoryId INTEGER,
          createdAt TEXT NOT NULL,
          updatedAt TEXT,
          FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT
        )
      `, (err) => {
                if (err) reject(err);
                else {
                    console.log('Database schema initialized.');
                    resolve();
                }
            });
        });
    });
}

module.exports = initializeSchema;
