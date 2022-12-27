const PinsService = require('../services/pins.service');

class PinsController {
    constructor() {
        this.pinsService = new PinsService();
    }

    createPin = async (req, res) => {
        try {
            const { title, content, image } = req.body;
            const userId = 1;
            // const { userId } = res.locals;
            console.log(title, content, userId, image);
            await this.pinsService.createPin(title, content, userId, image);
            return res.status(201).json({ message: '핀이 생성되었습니다.' });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                Message: '핀 생성에 실패하였습니다.',
            });
        }
    };

    findAllPins = async (req, res) => {
        try {
            const pins = await this.pinsService.findAllPins();
            res.status(200).json({ pins });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                Message: '핀 조회에 실패하였습니다.',
            });
        }
    };

    findOnePin = async (req, res) => {
        try {
            const { pinId } = req.params;
            const pin = await this.pinsService.findOnePin(pinId);
            res.status(200).json({ pin });
        } catch (error) {
            if (error.message === '핀이 존재하지않습니다.') {
                return res
                    .status(404)
                    .json({ Message: '존재하지않는 핀입니다.' });
            }
            res.status(400).json({
                Message: '핀 상세 조회에 실패하였습니다.',
            });
        }
    };

    updatePin = async (req, res) => {
        try {
            const { pinId } = req.params;
            const { title, content, image } = req.body;

            await this.pinsService.updatePin(pinId, title, content, image);
            return res.status(201).json({ message: '핀이 수정되었습니다.' });
        } catch (error) {
            console.log(error);
            if (error.message === '핀이 존재하지않습니다.') {
                return res
                    .status(404)
                    .json({ Message: '존재하지않는 핀입니다.' });
            }
            res.status(400).json({
                Message: '핀 수정에 실패하였습니다.',
            });
        }
    };

    deletePin = async (req, res) => {
        try {
            const { pinId } = req.params;

            await this.pinsService.deletePin(pinId);
            return res.status(200).json({ message: '핀이 삭제되었습니다' });
        } catch (error) {
            if (error.message === '핀이 존재하지않습니다.') {
                return res
                    .status(401)
                    .json({ errorMessage: '존재하지않는 핀입니다.' });
            }
            res.status(400).json({
                Message: '핀 삭제에 실패하였습니다.',
            });
        }
    };
}

module.exports = PinsController;
