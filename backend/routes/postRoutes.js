const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middlewares/auth');
const upload = require('../config/upload');

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

router.post('/', auth, upload.array('images', 10), postController.createPost);

router.put('/:id', auth, upload.array('images', 10), postController.updatePost);

router.delete('/:id', auth, postController.deletePost);

module.exports = router;
