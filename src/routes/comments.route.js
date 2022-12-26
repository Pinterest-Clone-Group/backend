const express = require('express');
const router = express.Router();
const CommentsController = require('../controllers/comments.controller');
const commentsController = new CommentsController();

router.post('/:pinId/comments', commentsController.createComment);
router.get('/:pinId/comments', commentsController.getComment);
router.put('/comments/:commentId', commentsController.updateComment);
router.delete('/comments/:commentId', commentsController.deleteComment);
//댓글 좋아요 기능
router.put('/comments/:commentId/like', commentsController.likeComment);
module.exports = router;
