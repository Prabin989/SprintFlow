import { Selector } from 'testcafe';

fixture`Task Management React Client Tests`
    .page`http://localhost:5173`;

test('App should load and display the Dashboard UI', async t => {
    await t.expect(Selector('h1').innerText).eql('SprintFlow');
    await t.expect(Selector('.stats-grid').exists).ok();
    await t.expect(Selector('.stat-card').count).eql(4);
});

test('App should fetch and display priority tasks', async t => {
    const taskCards = Selector('.simple-task-list .simple-task-item');
    await t.expect(taskCards.count).gt(0, 'Should load high-priority tasks from API');

    const firstTaskTitle = taskCards.nth(0).find('strong');
    await t.expect(firstTaskTitle.exists).ok();
});
