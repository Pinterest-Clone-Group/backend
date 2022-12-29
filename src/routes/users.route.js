const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();
const authTokenChecker = require('../middlewares/auth-token-checker.middleware');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/signup', usersController.signUpUser);
router.get('/kakao', usersController.kakaoLogin);
// use authTokenChecker middleware to prevent a user with authentication token to log in again
router.post('/login', authTokenChecker, usersController.loginUser);

// use authMiddleware to check if the user is authenticated
// to get a user detail page
router.get('/:userId', authMiddleware, usersController.getUserDetail);
router.put('/:userId', authMiddleware, usersController.modifyUserProfile);

router.get('/:userId/pins', authMiddleware, usersController.getUserCreatedPins);

router.get('/:userId/likes', authMiddleware, usersController.getUserLikedPins);


module.exports = router;
