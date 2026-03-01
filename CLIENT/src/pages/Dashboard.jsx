import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiAlertCircle, FiList } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksRes, categoriesRes] = await Promise.all([
                    fetch('http://localhost:3000/api/tasks'),
                    fetch('http://localhost:3000/api/categories')
                ]);

                if (!tasksRes.ok) throw new Error('Failed to fetch tasks');
                if (!categoriesRes.ok) throw new Error('Failed to fetch categories');

                const tasksData = await tasksRes.json();
                const categoriesData = await categoriesRes.json();

                setTasks(tasksData.tasks);
                setCategories(categoriesData.categories);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <Spinner />;
    if (error) return <div className="error-banner"><FiAlertCircle /> {error}</div>;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;

    const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done').slice(0, 5);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2>Dashboard</h2>
                    <p>Welcome back! Here's an overview of your workspace.</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon bg-blue"><FiList /></div>
                    <div className="stat-details">
                        <h3>Total Tasks</h3>
                        <p className="stat-number">{totalTasks}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-green"><FiCheckCircle /></div>
                    <div className="stat-details">
                        <h3>Completed</h3>
                        <p className="stat-number">{completedTasks}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-yellow"><FiClock /></div>
                    <div className="stat-details">
                        <h3>In Progress</h3>
                        <p className="stat-number">{inProgressTasks}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-gray"><FiAlertCircle /></div>
                    <div className="stat-details">
                        <h3>To Do</h3>
                        <p className="stat-number">{todoTasks}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="widget">
                    <h3>High Priority Tasks</h3>
                    {highPriorityTasks.length === 0 ? (
                        <p className="empty-state">No high priority tasks! You're all caught up.</p>
                    ) : (
                        <ul className="simple-task-list">
                            {highPriorityTasks.map(task => {
                                const category = categories.find(c => c.id === task.categoryId);
                                return (
                                    <Link to="/tasks" state={{ highlightTaskId: task.id }} key={task.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className="simple-task-item hoverable">
                                            <div className="task-info">
                                                <strong>{task.title}</strong>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <span className="task-date">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                                                    {category && (
                                                        <span className="badge" style={{ backgroundColor: 'white', color: 'var(--text-dark)', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: category.color, marginRight: '4px', display: 'inline-block' }}></span>
                                                            {category.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
                                        </li>
                                    </Link>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
