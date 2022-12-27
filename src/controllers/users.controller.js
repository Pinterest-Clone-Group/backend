const UsersService = require('../services/users.service');
const {
    InvalidParamsError,
    AuthenticationError,
} = require('../exceptions/index.exception');

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
            const token = await this.UsersService.loginUser(email, password);

            // return authentication: token -> to pass the token to client
            return res.status(200).json({
                authentication: token,
            });
        } catch (err) {
            // pass err to errorHandler middleware
            next(err);
        }
    };

    // API to get User Detail
    getUserDetail = async (req, res, next) => {
        try {
            const userId = res.locals.user;

            if (!userId) {
                throw new AuthenticationError(
                    'Unknown Error',
                    400
                );
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
}

module.exports = UsersController;
