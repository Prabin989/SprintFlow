import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';

function TaskCard({ task, onEdit, onDelete }) {
    const dateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date';

    return (
        <div className="task-card">
            <div className="task-card-header">
                <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                <div className="task-actions">
                    <button className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Edit Task">
                        <FiEdit2 />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => onDelete(task.id)} title="Delete Task">
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
