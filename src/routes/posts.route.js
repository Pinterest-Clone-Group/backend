const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

//즐겨찾기 기능
router.put('/:pinId/likes', postsController.likePin);
module.exports = router;
