const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const auth = require('../middlewares/auth');

router.get('/', settingController.getSettings);
router.put('/', auth, settingController.updateSettings);

module.exports = router;
