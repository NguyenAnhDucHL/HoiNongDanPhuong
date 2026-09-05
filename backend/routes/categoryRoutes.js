const express = require('express');
const router = express.Router();
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { verifyToken } = require('../controllers/authController');

// Public route to fetch categories (used by SubmitForm)
router.get('/', getCategories);

// Protected routes (used by Admin Dashboard)
router.post('/', verifyToken, addCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

module.exports = router;
