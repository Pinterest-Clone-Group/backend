const express = require('express');
const router = express.Router();
const pinRouter = require('./pins.route.js');
const commentRouter = require('./comments.route.js');
const userRouter = require('./users.route.js');

router.use('/pins', [pinRouter, commentRouter]);
router.use('/users', [userRouter]);

module.exports = router;