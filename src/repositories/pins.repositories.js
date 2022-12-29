const { Users, Pins, Likes } = require('../models');
const { Op } = require('sequelize');

class PinsRepository {
    createPin = async (title, content, userId, image) => {
        console.log(title, content, userId, image);

        await Pins.create({
            title,
            content,
            userId,
            image,
        });
    };

    findAllPins = async () => {
        return Pins.findAll({
            include: [
                {
                    model: Users,
                    attributes: ['name', 'image'],
                },
            ],
            raw: true,
            order: [['updatedAt', 'desc']],
        });
    };

    findOnePin = async (pinId) => {
        console.log(pinId);
        return Pins.findOne({
            where: { pinId },
            include: [
                {
                    model: Users,
                    attributes: ['name', 'image'],  // 팔로워, 팔로우하기 추가?
                },
            ],
            raw: true,
        });
    };

    updatePin = async (pinId, title, content, image) => {
        await Pins.update({ title, content, image }, { where: { pinId } });
    };

    deletePin = async (pinId) => {
        await Pins.destroy({
            where: { pinId },
        });
    };

    searchPin = async (search) => {
        const searchPin = await Pins.findAll({
            where: {
                title: {
                    [Op.substring]: search,
                },
            },
        })
        return searchPin;
    }

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

module.exports = PinsRepository;
