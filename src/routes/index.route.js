const express = require('express');
const router = express.Router();

const commentRouter = require('./comments.route.js');
const pinRouter = require('./pins.route.js');
const usersRouter = require('./users.route.js');
const followRelationshipsRouter = require('./followRelationships.route');

router.use('/pins', [pinRouter, commentRouter]);
router.use('/users', [usersRouter, followRelationshipsRouter]);

module.exports = router;