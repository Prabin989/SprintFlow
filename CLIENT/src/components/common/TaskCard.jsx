import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';

function TaskCard({ task, categories = [], onEdit, onDelete, isHighlighted }) {
    const dateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date';
    const category = categories.find(c => c.id === task.categoryId);

    return (
        <div id={`task-${task.id}`} className={`task-card ${isHighlighted ? 'highlighted-card' : ''}`}>
            <div className="task-card-header">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    {category && (
                        <span className="badge" style={{ backgroundColor: 'white', color: 'var(--text-dark)', border: '1px solid var(--border-color)' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: category.color, marginRight: '6px', display: 'inline-block' }}></span>
                            {category.name}
                        </span>
                    )}
                </div>
                <div className="task-actions">
                    <button className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Edit Task">
                        <FiEdit2 />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => onDelete(task)} title="Delete Task">
                        <FiTrash2 />
                    </button>
                </div>
            </div>

            <div className="task-card-body">
                <h3 className="task-title">{task.title}</h3>
                {task.description && <p className="task-desc">{task.description}</p>}
            </div>

            <div className="task-card-footer">
                <div className="task-meta">
                    <FiCalendar /> {dateStr}
                </div>
                <span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
            </div>
        </div>
    );
}

export default TaskCard;
