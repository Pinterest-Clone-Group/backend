const UsersRepository = require("../repositories/users.repository");
const { Users } = require('../models');
const { ValidationError } = require("../exceptions/index.exception");
const { hash } = require('../util/auth-encryption.util');
const { createToken } = require('../util/auth-jwtToken.util');

class UsersService {
    constructor() {
        this.usersRepository = new UsersRepository(Users);
    }

    // signUpUser with a hashed password - create a user in Users table
    signUpUser = async (email, password) => {

        const EMAIL_REGEX = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+$/;
        const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,20}$/;

        console.log(email)
        if (!EMAIL_REGEX.test(email)) {
            throw new ValidationError;
        }

        if (!PASSWORD_REGEX.test(password)) {
            throw new ValidationError;
        }

        const hashed_pw = hash(password);
        const name = email.substring(0, email.indexOf("@"));
        const username = name + Math.floor(Math.random() * 8999 + 1000).toString();
        
        const newUser = await this.usersRepository.createUser(email, name, hashed_pw, username);

        if (!newUser) {
            throw new ValidationError;
        }
    }

    // loginUser - find if there is a user with a given id
    loginUser = async (email, password) => {
        // find a user from Users table using id
        const target_user = await this.usersRepository.findUser(email);
        const hashed_pw = hash(password);

        if (!target_user || target_user.password !== hashed_pw) {
            throw new ValidationError('Incorrect id or password', 401)
        }

        // Now, just passing the access token - subject to be fixed with a refresh token
        const token = createToken(target_user.email, '1h');
        return token;
    }

    // getUserDetail - find if there is a user with a given email
    getUserDetail = async (email) => {
        // find a user from Users table using email
        const target_user = await this.usersRepository.findUser(email);

        if (!target_user) {
            throw new ValidationError;
        }

        // construct a new object user_detail - follow# missing as of now
        const user_detail = {
            name: target_user.name,
            image: target_user.image,
            username: target_user.username
        }

        return user_detail;
    }

}

module.exports = UsersService;