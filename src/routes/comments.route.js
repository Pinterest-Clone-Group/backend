const express = require('express');
const router = express.Router();
const CommentsController = require('../controllers/comments.controller');
const commentsController = new CommentsController();
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/:pinId/comments', authMiddleware, commentsController.createComment);
router.get('/:pinId/comments', authMiddleware, commentsController.getComment);
router.put('/comments/:commentId', authMiddleware, commentsController.updateComment);
router.delete('/comments/:commentId', authMiddleware, commentsController.deleteComment);
//댓글 좋아요 기능
router.put('/comments/:commentId/likes', authMiddleware, commentsController.likeComment);
module.exports = router;
