import { useState, useEffect } from 'react';

function TaskForm({ task, categories, onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setStatus(task.status || 'todo');
            setPriority(task.priority || 'medium');
            // Format date for input type="date" (YYYY-MM-DD)
            setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
            setCategoryId(task.categoryId || '');
        } else if (categories.length > 0) {
            // Default to first category if creating new
            setCategoryId(categories[0].id);
        }
    }, [task, categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !categoryId) {
            setError('Title and Category are required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const payload = {
            title,
            description,
            status,
            priority,
            dueDate: dueDate || null,
            categoryId: parseInt(categoryId, 10)
        };

        const url = 'http://localhost:3000/api/tasks' + (task ? `/${task.id}` : '');
        const method = task ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save task');
            }

            onSave(); // Trigger parent refresh
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{task ? 'Edit Task' : 'New Task'}</h2>
                    <button className="close-btn" onClick={onCancel}>&times;</button>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit} className="form-layout">
                    <div className="form-group">
                        <label htmlFor="title">Task Title *</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description (Optional)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label htmlFor="categoryId">Category *</label>
                            <select id="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                                <option value="" disabled>Select category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskForm;
