const express = require('express');
const CategoryController = require('../controllers/CategoryController');

const router = express.Router();

/**
 * @api {get} /categories Get all categories
 * @apiName GetCategories
 * @apiGroup Categories
 *
 * @apiSuccess {Object[]} categories List of categories.
 */
router.get('/', CategoryController.getAll);

/**
 * @api {get} /categories/:id Get category by ID
 * @apiName GetCategory
 * @apiGroup Categories
 */
router.get('/:id', CategoryController.getById);

/**
 * @api {post} /categories Create a new category
 * @apiName CreateCategory
 * @apiGroup Categories
 */
router.post('/', CategoryController.create);

/**
 * @api {put} /categories/:id Update category
 * @apiName UpdateCategory
 * @apiGroup Categories
 */
router.put('/:id', CategoryController.update);

/**
 * @api {delete} /categories/:id Delete category
 * @apiName DeleteCategory
 * @apiGroup Categories
 */
router.delete('/:id', CategoryController.delete);

module.exports = router;
