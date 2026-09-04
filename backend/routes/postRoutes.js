const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../config/upload');

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

router.post('/', protect, upload.array('image', 1), (req, res, next) => {
    if(req.files && req.files.length > 0) req.file = req.files[0];
    next();
}, postController.createPost);

router.put('/:id', protect, upload.array('image', 1), (req, res, next) => {
    if(req.files && req.files.length > 0) req.file = req.files[0];
    next();
}, postController.updatePost);

router.delete('/:id', protect, postController.deletePost);

module.exports = router;
