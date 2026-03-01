const express = require('express');
const TaskController = require('../controllers/TaskController');

const router = express.Router();

/**
 * @api {get} /tasks Get all tasks
 * @apiName GetTasks
 * @apiGroup Tasks
 * 
 * @apiParam (Query) {String} [status] Filter by status (todo, in-progress, done)
 * @apiParam (Query) {String} [priority] Filter by priority (low, medium, high)
 */
router.get('/', TaskController.getAll);

/**
 * @api {get} /tasks/:id Get task by ID
 * @apiName GetTask
 * @apiGroup Tasks
 */
router.get('/:id', TaskController.getById);

/**
 * @api {post} /tasks Create a new task
 * @apiName CreateTask
 * @apiGroup Tasks
 */
router.post('/', TaskController.create);

/**
 * @api {put} /tasks/:id Update a task
 * @apiName UpdateTask
 * @apiGroup Tasks
 */
router.put('/:id', TaskController.update);

/**
 * @api {delete} /tasks/:id Delete task
 * @apiName DeleteTask
 * @apiGroup Tasks
 */
router.delete('/:id', TaskController.delete);

module.exports = router;
