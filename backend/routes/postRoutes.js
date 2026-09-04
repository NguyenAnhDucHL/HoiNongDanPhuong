const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middlewares/auth');
const upload = require('../config/upload');

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

router.post('/', auth, upload.array('image', 1), (req, res, next) => {
    if (req.files && req.files.length > 0) req.file = req.files[0];
    next();
}, postController.createPost);

router.put('/:id', auth, upload.array('image', 1), (req, res, next) => {
    if (req.files && req.files.length > 0) req.file = req.files[0];
    next();
}, postController.updatePost);

router.delete('/:id', auth, postController.deletePost);

module.exports = router;
