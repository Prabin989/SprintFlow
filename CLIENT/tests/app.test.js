import { Selector } from 'testcafe';

fixture `Task Management React Client Tests`
    .page `http://localhost:5173`;

test('App should load and display the UI structure', async t => {
    await t.expect(Selector('h1').innerText).eql('TaskFlow');
    await t.expect(Selector('#col-pending').exists).ok();
    await t.expect(Selector('#col-in-progress').exists).ok();
    await t.expect(Selector('#col-completed').exists).ok();
});

test('App should fetch and display tasks', async t => {
    const pendingList = Selector('#list-completed .task-card');
    await t.expect(pendingList.count).gt(0, 'Should load tasks from API');

    const firstTaskTitle = Selector('#list-completed .task-card .task-title').nth(0);
    await t.expect(firstTaskTitle.innerText).notEql('');
});
