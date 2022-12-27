const { Users, Pins, Likes } = require('../models');
const { Op } = require("sequelize");

class PostRepositroy{


    findLike = async(userId, pinId) => {
        const existLike = await Likes.findOne({
            where: {
                [Op.and]: [
                    {userId, pinId}
                ]
            }
        });
        return existLike;
    }

    likePin = async(userId, pinId) => {
        const likePin = await Likes.create({
            userId, pinId
        });
        return 1;
    }

    delLikePin = async(userId, pinId) => {
        const delLikePin = await Likes.destroy({
            where: {
                [Op.and]: [
                    {userId, pinId}
                ]
            }
        });
        return 0;
    }

}

module.exports = PostRepositroy;