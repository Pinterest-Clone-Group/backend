const { User } = require('../models');
const { Op } = require('sequelize');

class PinsRepository {
    constructor(pinsModel) {
        this.pins = pinsModel;
    }

    createPin = async (data) => {
        await this.pins.create({
            userId: data.userId,
            title: data.title,
            content: data.content,
            pinImg: data.image,
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
