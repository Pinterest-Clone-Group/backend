const { Users, Pins } = require('../models');
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
        return this.pins.findAll({
            include: [
                {
                    model: User,
                    attributes: ['nickname'],
                },
            ],
            order: [['updatedAt', 'desc']],
        });
    };

    findOnePin = async (pinId) => {
        return this.pins.findOne({
            where: {
                [Op.or]: [{ pinId }],
            },
            include: [
                {
                    model: User,
                    attributes: ['nickname'],
                },
            ],
        });
    };

    updatePin = async (pinId, title, content, image) => {
        await this.pins.update(
            { title, content, pinImg: image },
            { where: { pinId } }
        );
    };

    deletePin = async (pinId) => {
        await this.pins.destroy({
            where: { pinId },
        });
    };
}

module.exports = PinsRepository;
