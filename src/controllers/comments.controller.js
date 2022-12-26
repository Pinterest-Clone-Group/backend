const CommentService = require('../services/comments.service');

class CommentController {
    constructor() {
        this.commentService = new CommentService();
    }

    createComment = async(req, res) => {
        try{
            //const { userId } = res.locals;
            const userId = 1;
            const { pinId } = req.params;
            let { comment, parentCommentId } = req.body;
            const like = 0;

            await this.commentService.createComment(
                userId, pinId, comment, parentCommentId, like
            );
            return res.status(200).json({ message: "댓글 생성 완료" });
        }catch(error) {
            console.log(error);
            return res.status(400).json({ errorMessage: "댓글 생성 실패" });
        }
    }

    getComment = async(req, res) => {
        try{
            const { pinId } = req.params;
            const commentList = await this.commentService.findAllComment(pinId);

            return res.status(200).json({ comment : commentList });
        }catch(error) {
            console.log(error);
            return res.status(400).json({ errorMessage: "댓글 목록 조회 실패." });
        }
    }

    updateComment = async(req, res) => {
        try{
            const { commentId } = req.params;
            const { comment } = req.body;
            //const { userId } = res.locals;
            const userId = 1;
            await this.commentService.updateComment(userId, commentId, comment);

            return res.status(200).json({ message: "댓글이 수정되었습니다." });
        }catch(error) {
            console.log(error);
            return res.status(400).json({ errorMessage: "댓글 수정 실패" });
        }
    }

    deleteComment = async(req, res) => {
        try{
            //const { userId } = res.locals;
            const userId = 1;
            const { commentId } = req.params;

            await this.commentService.deleteComment(userId, commentId);

            return res.status(200).json({ message: "댓글이 삭제되었습니다." });
        }catch(error) {
            console.log(error);
            return res.status(400).json({ errorMessage: "댓글 삭제 실패" });
        }
    }

    likeComment = async(req, res) => {
        try {
            //const { userId } = res.locals;
            const userId = 1;
            const { commentId } = req.params;
            console.log(commentId);
            const result = await this.commentService.likeComment(userId, commentId);
            if(result === 0){
                return res.status(200).json({ message: "댓글 좋아요 취소 성공" });
            }else { // result === 1
                return res.status(200).json({ message: "댓글 좋아요 성공" });
            }
        }catch(error) {
            console.log(error);
            return res.status(400).json({ errorMessage: "좋아요/좋아요 취소 실패" });
        }
    }
}

module.exports = CommentController;