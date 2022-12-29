const CommentService = require('../services/comments.service');
const {
    InvalidParamsError, AuthenticationError
} = require('../exceptions/index.exception');
class CommentController {
    constructor() {
        this.commentService = new CommentService();
    }

    createComment = async (req, res, next) => {
        try{
            const { userId } = res.locals;
            const { pinId } = req.params;
            let { comment, parentCommentId } = req.body;
            const like = 0;

            if (!userId) {
                throw new AuthenticationError;
            }

            if (!pinId || !comment) {
                throw new InvalidParamsError;
            }

            await this.commentService.createComment(
                userId, pinId, comment, parentCommentId, like
            );
            res.status(200).json({ message: "댓글 생성 완료" });
        }catch(err) {
            next(err);
        }
    }

    getComment = async(req, res, next) => {
        try{
            const { pinId } = req.params;

            if (!pinId) {
                throw new InvalidParamsError;
            }

            const commentList = await this.commentService.findAllComment(pinId);

            res.status(200).json({ comment : commentList });
        }catch(err) {
            next(err);
        }
    }

    updateComment = async(req, res, next) => {
        try{
            const { commentId } = req.params;
            const { comment } = req.body;
            const { userId } = res.locals;

            if (!commentId || !comment) {
                throw new InvalidParamsError;
            }

            if (!userId) {
                throw new AuthenticationError;
            }

            await this.commentService.updateComment(userId, commentId, comment);

            res.status(200).json({ message: "댓글이 수정되었습니다." });
        }catch(err) {
            next(err);
        }
    }

    deleteComment = async(req, res, next) => {
        try{
            const { userId } = res.locals;
            const { commentId } = req.params;

            if (!userId) {
                throw new AuthenticationError;
            }

            if (!commentId) {
                throw new InvalidParamsError;
            }

            await this.commentService.deleteComment(userId, commentId);

            res.status(200).json({ message: "댓글이 삭제되었습니다." });
        }catch(err) {
            next(err);
        }
    }

    likeComment = async(req, res, next) => {
        try {
            const { userId } = res.locals;
            const { commentId } = req.params;
            
            if (!userId) {
                throw new AuthenticationError;
            }

            if (!commentId) {
                throw new InvalidParamsError;
            }

            const result = await this.commentService.likeComment(userId, commentId);
            if(result === 0){
                res.status(200).json({ message: "댓글 좋아요 취소 성공" });
            }else { // result === 1
                res.status(200).json({ message: "댓글 좋아요 성공" });
            }
        }catch(err) {
            next(err);
        }
    }
}

module.exports = CommentController;