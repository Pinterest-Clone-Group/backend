const CommentService = require('../services/comments.service');
const {
    InvalidParamsError
} = require('../exceptions/index.exception');
class CommentController {
    constructor() {
        this.commentService = new CommentService();
    }

    createComment = async(req, res, next) => {
        try{
            const { userId } = res.locals;
            const { pinId } = req.params;
            let { comment, parentCommentId } = req.body;
            const like = 0;

            await this.commentService.createComment(
                userId, pinId, comment, parentCommentId, like
            );
            res.status(200).json({ message: "댓글 생성 완료" });
        }catch(err) {
            err = InvalidParamsError("댓글 생성 실패");
            next(err);
        }
    }

    getComment = async(req, res, next) => {
        try{
            const { pinId } = req.params;
            const commentList = await this.commentService.findAllComment(pinId);

            res.status(200).json({ comment : commentList });
        }catch(err) {
            err = InvalidParamsError("댓글 목록 조회 실패");
            next(err);
        }
    }

    updateComment = async(req, res, next) => {
        try{
            const { commentId } = req.params;
            const { comment } = req.body;
            const { userId } = res.locals;
            await this.commentService.updateComment(userId, commentId, comment);

            res.status(200).json({ message: "댓글이 수정되었습니다." });
        }catch(err) {
            err = InvalidParamsError("댓글 수정 실패");
            next(err);
        }
    }

    deleteComment = async(req, res, next) => {
        try{
            const { userId } = res.locals;
            const { commentId } = req.params;

            await this.commentService.deleteComment(userId, commentId);

            res.status(200).json({ message: "댓글이 삭제되었습니다." });
        }catch(err) {
            err = InvalidParamsError("댓글 삭제 실패");
            next(err);
        }
    }

    likeComment = async(req, res, next) => {
        try {
            //const { userId } = res.locals;
            const userId = 1;
            const { commentId } = req.params;
            console.log(commentId);
            const result = await this.commentService.likeComment(userId, commentId);
            if(result === 0){
                res.status(200).json({ message: "댓글 좋아요 취소 성공" });
            }else { // result === 1
                res.status(200).json({ message: "댓글 좋아요 성공" });
            }
        }catch(err) {
            err = InvalidParamsError("좋아요/좋아요 취소 실패");
            next(err);
        }
    }
}

module.exports = CommentController;