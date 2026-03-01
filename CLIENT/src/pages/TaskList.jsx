import { useState, useEffect } from 'react';
import { FiPlus, FiFilter } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';
import TaskCard from '../components/common/TaskCard.jsx';
import TaskForm from '../components/forms/TaskForm.jsx';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasksAndCategories = async () => {
        setIsLoading(true);
        try {
            // Fetch Categories first for the form dropdown
            const catRes = await fetch('http://localhost:3000/api/categories');
            if (catRes.ok) {
                const catData = await catRes.json();
                setCategories(catData.categories);
            }

            // Fetch Tasks
            let url = 'http://localhost:3000/api/tasks';
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (priorityFilter) params.append('priority', priorityFilter);
            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data.tasks);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasksAndCategories();
    }, [statusFilter, priorityFilter]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) fetchTasksAndCategories();
        } catch (err) {
            alert('Failed to delete task');
        }
    };

    const handleOpenForm = (task = null) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTask(null);
    };

    const handleSaveSuccess = () => {
        handleCloseForm();
        fetchTasksAndCategories();
    };

    if (isLoading && tasks.length === 0) return <Spinner />;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2>Tasks</h2>
                    <p>Manage all your work items</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenForm()}>
                    <FiPlus /> New Task
                </button>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="filters-bar">
                <div className="filter-group">
                    <FiFilter />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <div className="task-grid">
                {tasks.length === 0 ? (
                    <div className="empty-state">No tasks found matching these filters.</div>
                ) : (
                    tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={handleDelete}
                            onEdit={handleOpenForm}
                        />
                    ))
                )}
            </div>

            {isFormOpen && (
                <TaskForm
                    task={editingTask}
                    categories={categories}
                    onSave={handleSaveSuccess}
                    onCancel={handleCloseForm}
                />
            )}
        </div>
    );
}

export default TaskList;
