const CommentRepository = require('../repositories/comments.repository');
const {
    InvalidParamsError
} = require('../exceptions/index.exception');

class CommentService {
    constructor() {
        this.commentRepository = new CommentRepository();
    }

    createComment = async(userId, pinId, comment, parentCommentId, like) => {
        console.log(parentCommentId);
        if(parentCommentId === null) {
            const commentNum = await this.commentRepository.findCommentNum();
            parentCommentId = commentNum + 1;
        }
        console.log(parentCommentId);
        const createComment = await this.commentRepository.createComment(
            userId, pinId, comment, parentCommentId, like
        );
        return createComment;
    }

    findAllComment = async(pinId) => {
        const findAllComment = await this.commentRepository.findAllComment(pinId);
        return findAllComment.map((e) => {
            return {
                commentId: e.commentId,
                pinId: e.pinId,
                userId: e.userId,
                name : e['User.name'],
                image : e['User.image'],
                comment: e.comment,
                like: e.like,
                parentCommentId: e.parentCommentId,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt
            }
        });
    }

    updateComment = async(userId, commentId, comment) => {
        const existComment = await this.commentRepository.findComment(commentId);
        if(!existComment) {
            throw new InvalidParamsError('댓글을 찾을 수 없습니다.');
        }else if(existComment.userId !== userId) {
            throw new InvalidParamsError('권한이 없습니다.');
        }

        const update = await this.commentRepository.updateComment(userId, commentId, comment);
        return update;
    };

    deleteComment = async(userId, commentId) => {
        const existComment = await this.commentRepository.findComment(commentId);
        if(!existComment) {
            throw new InvalidParamsError('댓글을 찾을 수 없습니다.');
        }else if(existComment.userId !== userId) {
            throw new InvalidParamsError('권한이 없습니다.');
        }

        const del = await this.commentRepository.deleteComment(commentId);
        return del;
    }

    likeComment = async(userId, commentId) => {
        const findComment = await this.commentRepository.findComment(commentId);
        let like = findComment.like;
        const findLike = await this.commentRepository.findLike(userId, commentId);
        if(findLike){
            like -= 1;
            const dellikeComment = await this.commentRepository.dellikeComment(userId, commentId, like);
            return dellikeComment;
        }else {
            like += 1;
            const likeComment = await this.commentRepository.likeComment(userId, commentId, like);
            return likeComment;
        }
    }
}

module.exports = CommentService;