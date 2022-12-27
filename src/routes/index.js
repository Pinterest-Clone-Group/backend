const express = require('express');
const router = express.Router();

const pinsRouter = require('./pins.js');
router.use('/pins', [pinsRouter]);
// const commentRouter = require('./comments.route.js');
// const likeRouter = require('./likes.route.js');
// const postRouter = require('./posts.route.js');
// const usersRouter = require('./users.route.js');

// router.use('/posts', [likeRouter, commentRouter, postRouter]);
// router.use('/users', [usersRouter]);

module.exports = router;
