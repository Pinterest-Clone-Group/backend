const { Users, Comments, CommentLikes } = require('../models');
const { Op } = require("sequelize");

class CommentRepository {
    createComment = async(userId, pinId, comment, parentCommentId, like) => {
        await Comments.create({
            pinId, userId, comment, like, parentCommentId
        });
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
        const findAllComment = await Comments.max('commentId');
        console.log(findAllComment);
        return findAllComment
    }

    updateComment = async(userId, commentId, comment) => {
        await Comments.update(
            { comment },
            { where: {
                [Op.and]: [
                    {commentId},
                    {userId}
                ]
            }}
        );
    }

    deleteComment = async(commentId) => {
        await Comments.destroy(
            { where: {
                [Op.or]: [
                    {commentId},
                    {parentCommentId: commentId}
                ]
            }}
        );
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