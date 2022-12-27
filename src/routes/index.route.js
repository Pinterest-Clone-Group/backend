const express = require('express');
const router = express.Router();
const commentRouter = require('./comments.route.js');
const userRouter = require('./users.route.js');

router.use('/pins', [commentRouter]);
router.use('/users', [userRouter]);

module.exports = router;