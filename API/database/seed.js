const db = require('./connection');
const initializeSchema = require('./schema');

async function seedDatabase() {
    await initializeSchema();

    db.serialize(() => {
        // Clear existing data
        db.run(`DELETE FROM tasks`);
        db.run(`DELETE FROM categories`);

        // Reset auto-increment
        db.run(`DELETE FROM sqlite_sequence WHERE name='tasks' OR name='categories'`);

        // Insert 5 Categories
        const catStmt = db.prepare(`INSERT INTO categories (name, color, createdAt) VALUES (?, ?, ?)`);
        const dateNow = new Date().toISOString();

        const categories = [
            { name: 'Work', color: '#3b82f6' },
            { name: 'Personal', color: '#10b981' },
            { name: 'Health', color: '#ef4444' },
            { name: 'Development', color: '#8b5cf6' },
            { name: 'Finance', color: '#f59e0b' }
        ];

        categories.forEach(cat => catStmt.run(cat.name, cat.color, dateNow));
        catStmt.finalize();

        // Insert 20 Realistic Tasks
        const taskStmt = db.prepare(`INSERT INTO tasks (title, description, status, priority, dueDate, categoryId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

        const tasks = [
            { title: 'Update homepage layout', desc: 'Revamp the hero section to include new marketing copy.', status: 'done', priority: 'high', due: '2024-03-01', cat: 1 },
            { title: 'Fix login bug', desc: 'Users report unable to log in with special characters.', status: 'in-progress', priority: 'high', due: '2024-03-05', cat: 4 },
            { title: 'Database migration', desc: 'Migrate users table to PostgreSQL schema.', status: 'todo', priority: 'medium', due: '2024-03-10', cat: 4 },
            { title: 'Write API documentation', desc: 'Use apidoc to generate REST API docs.', status: 'done', priority: 'low', due: '2024-03-12', cat: 4 },
            { title: 'Client app styling', desc: 'Implement Figma designs in the client app using CSS.', status: 'in-progress', priority: 'medium', due: '2024-03-15', cat: 1 },
            { title: 'Setup CI/CD pipeline', desc: 'Configure GitHub Actions for automated testing.', status: 'todo', priority: 'high', due: '2024-03-18', cat: 4 },
            { title: 'Optimize images', desc: 'Compress hero images to improve load times.', status: 'todo', priority: 'low', due: '2024-03-20', cat: 1 },
            { title: 'Conduct user interview', desc: 'Interview 5 beta users for feedback.', status: 'done', priority: 'medium', due: '2024-02-28', cat: 1 },
            { title: 'Update privacy policy', desc: 'Consult legal team to update data handling sections.', status: 'todo', priority: 'high', due: '2024-04-01', cat: 1 },
            { title: 'Refactor auth middleware', desc: 'Move JWT validation to a separate utility module.', status: 'done', priority: 'medium', due: '2024-02-25', cat: 4 },
            { title: 'Design new logo', desc: 'Draft 3 concepts for the rebrand.', status: 'in-progress', priority: 'medium', due: '2024-03-25', cat: 1 },
            { title: 'Write test cases', desc: 'Write TestCafe scenarios for user signup flow.', status: 'todo', priority: 'high', due: '2024-03-30', cat: 4 },
            { title: 'Renew SSL certificate', desc: 'The current certificate expires next week.', status: 'done', priority: 'high', due: '2024-02-20', cat: 4 },
            { title: 'Upgrade Node version', desc: 'Update production environment to Node 20 LTS.', status: 'done', priority: 'low', due: '2024-02-22', cat: 4 },
            { title: 'Create marketing video', desc: 'Record and edit the 30-second promo video.', status: 'todo', priority: 'medium', due: '2024-04-05', cat: 1 },
            { title: 'Investigate memory leak', desc: 'Analyze heap snapshot from production server.', status: 'in-progress', priority: 'high', due: '2024-03-08', cat: 4 },
            { title: 'Implement dark mode', desc: 'Add CSS variables for a dark color theme.', status: 'todo', priority: 'low', due: '2024-04-10', cat: 1 },
            { title: 'Go to the gym', desc: 'Leg day.', status: 'todo', priority: 'medium', due: '2024-03-01', cat: 3 },
            { title: 'Do taxes', desc: 'File annual tax return.', status: 'todo', priority: 'high', due: '2024-04-15', cat: 5 },
            { title: 'Buy groceries', desc: 'Milk, eggs, bread.', status: 'done', priority: 'medium', due: '2024-02-28', cat: 2 }
        ];

        tasks.forEach((task) => {
            taskStmt.run(task.title, task.desc, task.status, task.priority, task.due, task.cat, dateNow, null);
        });

        taskStmt.finalize();

        console.log('Database seeded successfully with Categories and Tasks.');
    });
}

// Run if called directly
if (require.main === module) {
    seedDatabase().then(() => {
        // Give it a moment to finish async sqlite writes
        setTimeout(() => {
            console.log('Closing process.');
            process.exit(0);
        }, 100);
    });
}

module.exports = seedDatabase;
