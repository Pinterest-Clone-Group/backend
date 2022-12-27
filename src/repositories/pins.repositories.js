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
                    attributes: ['loginId'],
                },
            ],
            order: [['updatedAt', 'desc']],
        });
    };

    findOnePin = async (pinId) => {
        return Pins.findOne({
            where: {
                [Op.or]: [{ pinId }],
            },
            include: [
                {
                    model: Users,
                    attributes: ['loginId'],
                },
            ],
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
