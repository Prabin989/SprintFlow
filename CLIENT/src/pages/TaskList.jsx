import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiPlus, FiFilter, FiSearch } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';
import TaskCard from '../components/common/TaskCard.jsx';
import TaskForm from '../components/forms/TaskForm.jsx';
import DeleteConfirmation from '../components/common/DeleteConfirmation.jsx';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deletingTask, setDeletingTask] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const location = useLocation();
    const [highlight, setHighlight] = useState(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const highlightTaskId = location.state?.highlightTaskId || null;

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

    useEffect(() => {
        if (highlightTaskId && tasks.length > 0 && !hasScrolled) {
            setHighlight(highlightTaskId);
            setHasScrolled(true);

            setTimeout(() => {
                const element = document.getElementById(`task-${highlightTaskId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 150);

            const timer = setTimeout(() => {
                setHighlight(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [tasks, highlightTaskId, hasScrolled]);

    const handleDeleteClick = (task) => {
        setDeletingTask(task);
    };

    const confirmDelete = async () => {
        if (!deletingTask) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${deletingTask.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setDeletingTask(null);
                fetchTasksAndCategories();
            }
        } catch (err) {
            alert('Failed to delete task');
        } finally {
            setIsDeleting(false);
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

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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

            <div className="filters-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div className="filter-group" style={{ flex: '1', minWidth: '200px' }}>
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%' }}
                    />
                </div>
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
                {filteredTasks.length === 0 ? (
                    <div className="empty-state">No tasks found matching these filters.</div>
                ) : (
                    filteredTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            categories={categories}
                            onDelete={handleDeleteClick}
                            onEdit={handleOpenForm}
                            isHighlighted={highlight === task.id}
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

            {deletingTask && (
                <DeleteConfirmation
                    title="Delete Task"
                    message={`Are you sure you want to permanently delete "${deletingTask.title}"? This action cannot be undone.`}
                    isDeleting={isDeleting}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletingTask(null)}
                />
            )}
        </div>
    );
}

export default TaskList;
