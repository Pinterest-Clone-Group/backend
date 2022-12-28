const { Users, Comments, CommentLikes } = require('../models');
const { Op } = require("sequelize");

class CommentRepository {
    createComment = async(userId, pinId, comment, parentCommentId, like) => {
        const createComment = await Comments.create({
            pinId, userId, comment, like, parentCommentId
        });
        return createComment;
    }

    findComment = async(commentId) => {
        const findComment = await Comments.findOne({ 
            where: {commentId},
            raw:true
            });
        return findComment;
    }

    findAllComment = async(pinId) => {
        const findAllComment = await Comments.findAll(
            { where: {pinId},
            include: [
                {
                    model: Users,
                    attributes: ['name', 'image'],
                }
            ],
            raw: true,
            order: [['parentCommentId', 'ASC'],
                    ['createdAt', 'ASC']]
            }
        )
        return findAllComment;
    }

    findCommentNum = async() => {
        const findAllComment = await Comments.findAll({
            raw: true
        });
        return findAllComment
    }

    updateComment = async(userId, commentId, comment) => {
        const updateComment = await Comments.update(
            { comment },
            { where: {
                [Op.and]: [
                    {commentId},
                    {userId}
                ]
            }}
        );
        return updateComment;
    }

    deleteComment = async(commentId) => {
        const deleteComment = await Comments.destroy(
            { where: {
                [Op.or]: [
                    {commentId},
                    {parentCommentId: commentId}
                ]
            }}
        );
        return deleteComment;
    }
    
    findLike = async(userId, commentId) => {
        const existLike = await CommentLikes.findOne({
            where: {
                [Op.and]: [
                    {userId, commentId}
                ]
            }
        });
        return existLike;
    }

    dellikeComment = async(userId, commentId, like) => {
        const dellikeComment = await CommentLikes.destroy({
            where: {commentId, userId}
        });
        const likeUpdateComment = await Comments.update(
            {like},
            {   where: {commentId},
                attributes: ['like']
        });
        return 0;
    }
    
    likeComment = async(userId, commentId, like) => {
        const createLikeComment = await CommentLikes.create({
            userId, commentId
        });
        const likeUpdateComment = await Comments.update(
            {like},
            {   where: {commentId},
                attributes: ['like']
        });
        return 1;
    }
}

module.exports = CommentRepository;