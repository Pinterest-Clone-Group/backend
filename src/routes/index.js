const express = require('express');
const router = express.Router();

const commentRouter = require('./comments.route.js');
const pinRouter = require('./pins.route.js');
const usersRouter = require('./users.route.js');
const loginRouter = require('./login.route.js');
const followRelationshipsRouter = require('./followRelationships.route');

router.use('/login', [loginRouter]);
router.use('/pins', [commentRouter, pinRouter]);
router.use('/users', [usersRouter, followRelationshipsRouter]);

module.exports = router;
