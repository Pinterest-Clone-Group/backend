const UsersService = require('../services/users.service');
const {
    InvalidParamsError,
    AuthenticationError,
} = require('../exceptions/index.exception');
const { access } = require('fs');

class UsersController {
    constructor() {
        this.UsersService = new UsersService();
    }

    // API for user signup
    signUpUser = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new InvalidParamsError();
            }
            // call signUpUser in service - create a user in Users table
            await this.UsersService.signUpUser(email, password);

            res.status(201).json({
                message: 'Signup Complete!',
            });
        } catch (err) {
            // pass err to errorHandler middleware
            next(err);
        }
    };

    // API for user login
    loginUser = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new InvalidParamsError();
            }

            // call loginUser in service - log in with id and pw
            const {accessToken, refreshToken} = await this.UsersService.loginUser(email, password);

            // return authentication: token -> to pass the token to client
            return res.status(200).json({
                accessToken: "Bearer " + accessToken,
                refreshToken
            });
        } catch (err) {
            // pass err to errorHandler middleware
            next(err);
        }
    };

    // API to get User Detail
    getUserDetail = async (req, res, next) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                throw new InvalidParamsError;
            }
            
            // call getUserDetail to get user information using userID
            const target_user_detail = await this.UsersService.getUserDetail(
                userId
            );

            return res.status(200).json({
                data: target_user_detail,
            });
        } catch (err) {
            next(err);
        }
    };

    // API to get user liked pins
    getUserLikedPins = async (req, res, next) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                throw new InvalidParamsError;
            }

            // call getUserCreatedPins to get user craeted pins information using userID
            const user_liked_pins = await this.UsersService.getUserLikedPins(
                userId
            );

            return res.status(200).json({
                data: user_liked_pins,
            });
        } catch (err) {
            next(err);
        }
    }

    // API to get user created pins
    getUserCreatedPins = async (req, res, next) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                throw new InvalidParamsError;
            }
            
            // call getUserCreatedPins to get user craeted pins information using userID
            const user_created_pins = await this.UsersService.getUserCreatedPins(
                userId
            );

            return res.status(200).json({
                data: user_created_pins,
            });
        } catch (err) {
            next(err);
        }
    }
    

    kakaoLogin = async(req, res, next) => {
        try{
            const { code } = req.query;

            if(!code) {
                throw new InvalidParamsError('카카오 로그인에 실패하였습니다.');
            }
            
            const {user, accessToken, refreshToken} = await this.UsersService.kakaoLogin(code);
            return res
                .header({ accessToken, refreshToken })
                .status(200)
                .json({
                    message: `${user.name}님의 로그인이 완료 되었습니다.`
                });
        }catch(error){
            console.log(error);
            next(error);
        }
    }
}

module.exports = UsersController;
