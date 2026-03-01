import TaskCard from './TaskCard.jsx';

function TaskColumn({ title, tasks, id, colId }) {
    return (
        <div className="column" id={colId}>
            <div className="column-header">
                <h2>{title}</h2>
                <span className="count">{tasks.length}</span>
            </div>
            <div className="task-list" id={id}>
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}

export default TaskColumn;
