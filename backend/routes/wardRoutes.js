const express = require('express');
const router = express.Router();
const { getWards, addWard, updateWard, deleteWard } = require('../controllers/wardController');
const { verifyToken } = require('../controllers/authController');

// Public route to fetch wards (used by SubmitForm)
router.get('/', getWards);

// Protected routes (used by Admin Dashboard)
router.post('/', verifyToken, addWard);
router.put('/:id', verifyToken, updateWard);
router.delete('/:id', verifyToken, deleteWard);

module.exports = router;
