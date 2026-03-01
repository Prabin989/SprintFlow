function TaskCard({ task }) {
    const dateStr = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date';
    const statusColor = task.status === 'in-progress' ? 'dot-in-progress' : (task.status === 'completed' ? 'dot-completed' : 'dot-pending');

    return (
        <div className="task-card" data-id={task.id}>
            <div className="task-title">{task.title}</div>
            <div className="task-desc">{task.description || ''}</div>
            <div className="task-meta">
                <div className="task-date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {dateStr}
                </div>
                <div><span className={`dot ${statusColor}`} title={task.status}></span></div>
            </div>
        </div>
    );
}

export default TaskCard;

