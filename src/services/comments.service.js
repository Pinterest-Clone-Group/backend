const CommentRepository = require('../repositories/comments.repository');

class CommentService {
    constructor() {
        this.commentRepository = new CommentRepository();
    }

    createComment = async(userId, pinId, comment, parentCommentId, like) => {
        if(parentCommentId === null) {
            const commentNum = await this.commentRepository.findCommentNum();
            parentCommentId = commentNum.length + 1;
        }
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
            throw new error('댓글을 찾을 수 없습니다.');
        }else if(existComment.userId !== userId) {
            throw new error('권한이 없습니다.');
        }

        const update = await this.commentRepository.updateComment(userId, commentId, comment);
        return update;
    };

    deleteComment = async(userId, commentId) => {
        const existComment = await this.commentRepository.findComment(commentId);
        if(!existComment) {
            throw new error('댓글을 찾을 수 없습니다.');
        }else if(existComment.userId !== userId) {
            throw new error('권한이 없습니다.');
        }

        const del = await this.commentRepository.deleteComment(commentId);
        return del;
    }

    likeComment = async(userId, commentId) => {
        const findComment = await this.commentRepository.findComment(commentId);
        let like = findComment.like;
        console.log(findComment);
        console.log(like);
        const likeComment = await this.commentRepository.likeComment(userId, commentId, like);
        return likeComment;
    }
}

module.exports = CommentService;