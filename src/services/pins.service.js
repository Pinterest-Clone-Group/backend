const PinsRepository = require('../repositories/pins.repositories');
const { Pins } = require('../models');

class PinsService {
    constructor() {
        this.pinsRepository = new PinsRepository(Pins);
    }

    createPin = async (title, content, userId, image) => {
        return await this.pinsRepository.createPin(
            title,
            content,
            userId,
            image
        );
    };

    findAllPins = async () => {
        const pins = await this.pinsRepository.findAllPins();

        return pins.map((allPins) => {
            return {
                pinId: allPins.pinId,
                userId: allPins.userId,
                title: allPins.title,
                image: allPins.image,
                content: allPins.content,
                createdAt: formatDate(allPins.createdAt),
                updatedAt: formatDate(allPins.updatedAt),
            };
        });
    };

    findOnePin = async (pinId) => {
        const pin = await this.pinsRepository.findOnePin(pinId);
        if (!pin) throw new Error('핀이 존재하지않습니다.');

        return {
            pinId: pin.pinId,
            userId: pin.userId,
            title: pin.title,
            image: pin.image,
            content: pin.content,
            createdAt: formatDate(pin.createdAt),
            updatedAt: formatDate(pin.updatedAt),
        };
    };

    updatePin = async (pinId, title, content, image) => {
        const pin = await this.pinsRepository.findOnePin(pinId);
        if (!pin) throw new Error('핀이 존재하지않습니다.');

        await this.pinsRepository.updatePin(pinId, title, content, image);
    };
    deletePin = async (pinId) => {
        const pin = await this.pinsRepository.findOnePin(pinId);

        if (!pin) throw new Error('핀이 존재하지않습니다.');

        await this.pinsRepository.deletePin(pinId);
    };
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = PinsService;
