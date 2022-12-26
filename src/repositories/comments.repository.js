const { Users, Pins, Comments, CommentLikes } = require('../models');
const { Op } = require("sequelize");

class CommentRepository {
    
    createComment = async(userId, pinId, comment, parentCommentId, like) => {
        // const loginId = "testUser";
        // const password = "test";
        // let image = "testImage.jpg";
        // const name = "testUserName";
        // const introduce = "testIntroduce";
        // const website = "testWebSite";
        // const createUser = await Users.create({
        //     userId, loginId, password, image, name, introduce, website
        // });
        // console.log(createUser);
        // const title = "testTitle";
        // const content = "testContent";
        // image = "testPinimage.jpg";
        // const createPin = await Pins.create({
        //     userId, title, content, image
        // });
        // console.log(createPin);
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
    
    likeComment = async(userId, commentId, like) => {
        const existLike = await CommentLikes.findOne({
            where: {
                [Op.and]: [
                    {userId, commentId}
                ]
            }
        });
        console.log(existLike);
        if(existLike) {
            like -= 1;
            const dellikeComment = await CommentLikes.destroy({
                where: {commentId, userId}
            });
            const likeUpdateComment = await Comments.update(
                {like},
                {   where: {commentId},
                    attributes: ['like']
            });
            return 0;
        }else {
            like += 1;
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
}

module.exports = CommentRepository;