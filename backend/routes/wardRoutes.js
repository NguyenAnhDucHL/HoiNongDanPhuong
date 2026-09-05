const express = require('express');
const router = express.Router();
const { getWards, addWard, updateWard, deleteWard } = require('../controllers/wardController');
const auth = require('../middlewares/auth');

// Public route to fetch wards (used by SubmitForm)
router.get('/', getWards);

// Protected routes (used by Admin Dashboard)
router.post('/', auth, addWard);
router.put('/:id', auth, updateWard);
router.delete('/:id', auth, deleteWard);

module.exports = router;
