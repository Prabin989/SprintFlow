const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  // Create the tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('pending', 'in-progress', 'completed')) NOT NULL DEFAULT 'pending',
      due_date TEXT
    )
  `);

  // Clear existing data
  db.run(`DELETE FROM tasks`);

  // Insert 20 realistic task records
  const stmt = db.prepare(`INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)`);

  const tasks = [
    { title: 'Update homepage layout', description: 'Revamp the hero section to include new marketing copy.', status: 'completed', due_date: '2024-03-01' },
    { title: 'Fix login bug', description: 'Users report unable to log in with special characters in password.', status: 'in-progress', due_date: '2024-03-05' },
    { title: 'Database migration', description: 'Migrate users table to PostgreSQL schema.', status: 'pending', due_date: '2024-03-10' },
    { title: 'Write API documentation', description: 'Use apidoc to generate REST API docs.', status: 'completed', due_date: '2024-03-12' },
    { title: 'Client app styling', description: 'Implement Figma designs in the client app using CSS.', status: 'in-progress', due_date: '2024-03-15' },
    { title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated testing.', status: 'pending', due_date: '2024-03-18' },
    { title: 'Optimize images', description: 'Compress hero images to improve load times.', status: 'pending', due_date: '2024-03-20' },
    { title: 'Conduct user interview', description: 'Interview 5 beta users for feedback on the new dashboard.', status: 'completed', due_date: '2024-02-28' },
    { title: 'Update privacy policy', description: 'Consult legal team to update data handling sections.', status: 'pending', due_date: '2024-04-01' },
    { title: 'Refactor auth middleware', description: 'Move JWT validation to a separate utility module.', status: 'completed', due_date: '2024-02-25' },
    { title: 'Design new logo', description: 'Draft 3 concepts for the rebrand.', status: 'in-progress', due_date: '2024-03-25' },
    { title: 'Write test cases', description: 'Write TestCafe scenarios for user signup flow.', status: 'pending', due_date: '2024-03-30' },
    { title: 'Renew SSL certificate', description: 'The current certificate expires next week.', status: 'completed', due_date: '2024-02-20' },
    { title: 'Upgrade Node version', description: 'Update production environment to Node 20 LTS.', status: 'completed', due_date: '2024-02-22' },
    { title: 'Create marketing video', description: 'Record and edit the 30-second promo video.', status: 'pending', due_date: '2024-04-05' },
    { title: 'Investigate memory leak', description: 'Analyze heap snapshot from production server.', status: 'in-progress', due_date: '2024-03-08' },
    { title: 'Implement dark mode', description: 'Add CSS variables for a dark color theme.', status: 'pending', due_date: '2024-04-10' },
    { title: 'Sync with analytics team', description: 'Weekly sync to discuss conversion rates.', status: 'completed', due_date: '2024-03-01' },
    { title: 'Draft blog post', description: 'Write an article about our shift to agile development.', status: 'in-progress', due_date: '2024-03-14' },
    { title: 'Prepare monthly report', description: 'Compile financial and usage metrics for shareholders.', status: 'pending', due_date: '2024-04-02' }
  ];

  tasks.forEach((task) => {
    stmt.run(task.title, task.description, task.status, task.due_date);
  });

  stmt.finalize();

  console.log('Database seeded successfully with 20 records.');
});

db.close();
