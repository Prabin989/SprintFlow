const CategoryModel = require('../models/CategoryModel');

class CategoryController {
    static async getAll(req, res) {
        try {
            const categories = await CategoryModel.getAll();
            res.json({ categories });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getById(req, res) {
        try {
            const category = await CategoryModel.getById(req.params.id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ category });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async create(req, res) {
        const { name, color } = req.body;
        if (!name || !color) {
            return res.status(400).json({ error: 'Name and color fields are required' });
        }

        try {
            const newCat = await CategoryModel.create(name, color);
            res.status(201).json({ message: 'Category created successfully', category: newCat });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async update(req, res) {
        const { name, color } = req.body;
        const { id } = req.params;

        try {
            const changes = await CategoryModel.update(id, name, color);
            if (changes === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ message: 'Category updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async delete(req, res) {
        try {
            const changes = await CategoryModel.delete(req.params.id);
            if (changes === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ message: 'Category deleted successfully' });
        } catch (err) {
            if (err.message.includes('Cannot delete category')) {
                return res.status(400).json({ error: err.message });
            }
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = CategoryController;
