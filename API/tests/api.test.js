const request = require('supertest');
const app = require('../app');
const db = require('../database/connection');
const initializeSchema = require('../database/schema');

// Suppress console logs during tests to keep output clean, except for errors
beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });

    // Set up the schema for testing in the actual database (to keep it simple for now)
    // Usually this would use an in-memory SQLite db for testing, but let's just use the current file.
    await initializeSchema();
});

afterAll((done) => {
    console.log.mockRestore();
    console.error.mockRestore();
    // Don't close DB to avoid errors in async callbacks running after suite ends
    done();
});

describe('API Endpoints Testing', () => {

    let testCategoryId;
    let testTaskId;

    describe('Categories API', () => {
        it('POST /api/categories should create a category', async () => {
            const res = await request(app)
                .post('/api/categories')
                .send({
                    name: 'Test Category',
                    color: '#000000'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('category');
            testCategoryId = res.body.category.id;
        });

        it('GET /api/categories should return all categories', async () => {
            const res = await request(app).get('/api/categories');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('categories');
            expect(Array.isArray(res.body.categories)).toBeTruthy();
            expect(res.body.categories.length).toBeGreaterThan(0);
        });

        it('PUT /api/categories/:id should update a category', async () => {
            const res = await request(app)
                .put(`/api/categories/${testCategoryId}`)
                .send({ name: 'Updated Test Category' });
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Category updated successfully');
        });

        it('POST /api/categories should return 400 when missing required fields', async () => {
            const res = await request(app)
                .post('/api/categories')
                .send({ name: 'Only Name' });
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toBeDefined();
        });
    });

    describe('Tasks API', () => {
        it('POST /api/tasks should create a task', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .send({
                    title: 'Test Task',
                    description: 'A test task',
                    status: 'todo',
                    priority: 'high',
                    categoryId: testCategoryId
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('task');
            testTaskId = res.body.task.id;
        });

        it('GET /api/tasks should return all tasks', async () => {
            const res = await request(app).get('/api/tasks');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('tasks');
            expect(Array.isArray(res.body.tasks)).toBeTruthy();
        });

        it('PUT /api/tasks/:id should update a task', async () => {
            const res = await request(app)
                .put(`/api/tasks/${testTaskId}`)
                .send({ status: 'done', priority: 'low' });
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Task updated successfully');
        });

        it('DELETE /api/categories/:id should fail when it has tasks attached (400)', async () => {
            const res = await request(app).delete(`/api/categories/${testCategoryId}`);
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toContain('Tasks are currently assigned');
        });

        it('DELETE /api/tasks/:id should remove the task', async () => {
            const res = await request(app).delete(`/api/tasks/${testTaskId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Task deleted successfully');
        });

        it('DELETE /api/tasks/:id should return 404 for removed task', async () => {
            const res = await request(app).delete(`/api/tasks/${testTaskId}`);
            expect(res.statusCode).toEqual(404);
        });

        it('DELETE /api/categories/:id should succeed after tasks are removed', async () => {
            const res = await request(app).delete(`/api/categories/${testCategoryId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Category deleted successfully');
        });
    });
});
