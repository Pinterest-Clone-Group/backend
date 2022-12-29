const PinsService = require('../services/pins.service');
const {
    InvalidParamsError, AuthenticationError, ValidationError
} = require('../exceptions/index.exception');
const { use } = require('passport');
const url = require('url');

class PinsController {
    constructor() {
        this.pinsService = new PinsService();
    }

    createPin = async (req, res, next) => {
        try {
            const { title, content, image } = req.body;

            if (!title || !content || !image) {
                throw new InvalidParamsError;
            }

            const { userId } = res.locals;

            if (!userId) {
                throw new AuthenticationError;
            }
            
            await this.pinsService.createPin(title, content, userId, image);
            return res.status(200).json({
                message: '핀이 생성되었습니다.'
            });
        } catch (error) {
            next(error);
        }
    };

    findAllPins = async (req, res, next) => {
        try {
            const pins = await this.pinsService.findAllPins();

            res.status(200).json({
                data: pins
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    findOnePin = async (req, res, next) => {
        try {
            const { pinId } = req.params;

            if (!pinId) {
                throw new InvalidParamsError;
            }
            
            const pin = await this.pinsService.findOnePin(pinId);
            res.status(200).json({
                data: pin
            });
        } catch (error) {
            next(error);
        }
    };

    updatePin = async (req, res, next) => {
        try {
            const { pinId } = req.params;
            const { title, content, image } = req.body;

            if (!pinId) {
                throw new InvalidParamsError;
            }

            if (!title || !content || !image) {
                throw new InvalidParamsError;
            }

            const { userId } = res.locals;

            if (!userId) {
                throw new AuthenticationError;
            }

            await this.pinsService.updatePin(pinId, title, content, image);
            return res.status(200).json({
                message: '핀이 수정되었습니다.'
            });
        } catch (error) {
            next(error);
        }
    };

    searchPin = async(req, res, next) => {
        try{
            const queryData = url.parse(req.url, true).query;
            const { search } = queryData;

            const result = await this.pinsService.searchPin(search);
            res.status(200).json({
                result
            });
        }catch(error){
            next(error);
        }
    }

    deletePin = async (req, res, next) => {
        try {
            const { pinId } = req.params;

            if (!pinId) {
                throw new InvalidParamsError;
            }

            const { userId } = res.locals;

            if (!userId) {
                throw new AuthenticationError;
            }

            await this.pinsService.deletePin(pinId);
            return res.status(200).json({
                message: '핀이 삭제되었습니다'
            });
        } catch (error) {
            next(error);
        }
    };

    likePin = async(req, res, next) => {
        try{
            const { userId } = res.locals;
            const { pinId } = req.params;

            if (!userId) {
                throw new AuthenticationError;
            }
            
            if (!pinId) {
                throw new InvalidParamsError;
            }

            const result = await this.pinsService.likePin(userId, pinId);
            if(result === 1){
                res.status(200).json({ message: "핀 즐겨찾기 성공" });
            }else{ // result === 0
                res.status(200).json({ message: "핀 즐겨찾기 해제 성공" });
            }
        }catch(error){
            next(error);
        }
    }
}

module.exports = PinsController;
