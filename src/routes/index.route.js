const express = require('express');
const router = express.Router();
const commentRouter = require('./comments.route.js');
const userRouter = require('./users.route.js');
const loginRouter = require('./login.route.js');

router.use('/login', loginRouter);
router.use('/pins', [commentRouter]);
router.use('/users', [userRouter]);

module.exports = router;