const express = require('express');
const router = express.Router();
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const auth = require('../middlewares/auth');

// Public route to fetch categories (used by SubmitForm)
router.get('/', getCategories);

// Protected routes (used by Admin Dashboard)
router.post('/', auth, addCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;
