const express = require('express');
const router = express.Router();
const FollowsController = require('../controllers/followRelationships.controller');
const followsController = new FollowsController();
const authMiddleware = require('../middlewares/auth-middleware');

router.put('/:userId/follows', authMiddleware, followsController.followUser);

router.get('/:userId/follows', authMiddleware, followsController.getFollowers);



module.exports = router;