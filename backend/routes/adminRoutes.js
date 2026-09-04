const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

// All admin routes require authentication
router.use(auth);

// Dashboard stats
router.get('/dashboard', adminController.getDashboard);

// Petition management
router.get('/petitions', adminController.getPetitions);
router.get('/petitions/:id', adminController.getPetitionDetail);
router.patch('/petitions/:id/status', adminController.updateStatus);
router.delete('/petitions/:id', adminController.deletePetition);

module.exports = router;
