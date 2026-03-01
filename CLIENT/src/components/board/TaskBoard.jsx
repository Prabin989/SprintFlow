import TaskColumn from './TaskColumn';

function TaskBoard({ tasks }) {
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="board">
            <TaskColumn title="Pending" tasks={pendingTasks} id="list-pending" colId="col-pending" />
            <TaskColumn title="In Progress" tasks={inProgressTasks} id="list-in-progress" colId="col-in-progress" />
            <TaskColumn title="Completed" tasks={completedTasks} id="list-completed" colId="col-completed" />
        </div>
    );
}

export default TaskBoard;
