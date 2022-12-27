const express = require('express');
const router = express.Router();

const commentRouter = require('./comments.route.js');
const pinRouter = require('./pins.route.js');
const usersRouter = require('./users.route.js');
const loginRouter = require('./login.route.js');

router.use('/login', [loginRouter]);
router.use('/pins', [commentRouter, pinRouter]);
router.use('/users', [usersRouter]);

module.exports = router;
