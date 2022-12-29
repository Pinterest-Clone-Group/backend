const PinsRepository = require('../repositories/pins.repositories');
const { Pins } = require('../models');
const {
    InvalidParamsError
} = require('../exceptions/index.exception');

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
                name: allPins['User.name'],
                userImage: allPins['User.image'],
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
            name: pin['User.name'],
            userImage: pin['User.image'],
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

    searchPin = async (search) => {
        const result = await this.pinsRepository.searchPin(search);
        return result;
    }

    likePin = async(userId, pinId) => {
        const existPin = await this.pinsRepository.findOnePin(pinId);
        if(!existPin) throw new InvalidParamsError("존재하지 않는 핀입니다.");
        const findLike = await this.pinsRepository.findLike(userId, pinId);
        if(findLike){
            const delLikePin = await this.pinsRepository.delLikePin(userId, pinId);
             return delLikePin;
        }else {
            const likePin = await this.pinsRepository.likePin(userId, pinId);
            return likePin;
        }
    }
}

function formatDate(date) {
    const d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = PinsService;
