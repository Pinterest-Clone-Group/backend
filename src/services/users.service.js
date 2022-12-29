const UsersRepository = require("../repositories/users.repository");
const { Users, Pins, Likes } = require('../models');
const { ValidationError } = require("../exceptions/index.exception");
const { hash } = require('../util/auth-encryption.util');
const { createAccessToken, createRefreshToken } = require('../util/auth-jwtToken.util');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();


class UsersService {
    constructor() {
        this.usersRepository = new UsersRepository(Users, Pins, Likes);
    }

    // signUpUser with a hashed password - create a user in Users table
    signUpUser = async (email, password) => {

        const EMAIL_REGEX = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+$/;
        const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,20}$/;

        if (!EMAIL_REGEX.test(email)) {
            throw new ValidationError;
        }

        if (!PASSWORD_REGEX.test(password)) {
            throw new ValidationError;
        }

        // 회원가입 시 findUserbyEmail 메서드 실행시 null 값이 나오는데도 불구하고 if 검출됨
        const existEmail = await this.usersRepository.findUserbyEmail(email)
        if (existEmail) {
            throw new ValidationError('Already Signed Up');
        }

        const hashed_pw = hash(password);
        const name = email.substring(0, email.indexOf("@"));
        const username = name;
        const category = "email";

        const newUser = await this.usersRepository.createUser(email, name, hashed_pw, username, category);
        if (!newUser) {
            throw new ValidationError;
        }
    }

    // loginUser - find if there is a user with a given id
    loginUser = async (email, password) => {
        // find a user from Users table using id
        const target_user = await this.usersRepository.findUserbyEmail(email);
        const hashed_pw = hash(password);

        if (!target_user || target_user.password !== hashed_pw) {
            throw new ValidationError('Incorrect id or password', 401)
        }

        // Now, just passing the access token - subject to be fixed with a refresh token
        const accessToken = createAccessToken(target_user.userId, '1h');
        const refreshToken = createRefreshToken('7D');
        return {accessToken, refreshToken};
    }

    // getUserDetail - find if there is a user with a given email
    getUserDetail = async (userId) => {
        // find a user from Users table using email
        const target_user = await this.usersRepository.findUser(userId);

        if (!target_user) {
            throw new ValidationError;
        }

        // construct a new object user_detail - follow# missing as of now
        const user_detail = {
            userId: target_user.userId,
            name: target_user.name,
            image: target_user.image,
            username: target_user.username
        }

        return user_detail;
    }

    getUserCreatedPins = async (userId) => {
        const user_created_pins = await this.usersRepository.findCreatedPins(userId);
        return user_created_pins.map((pin) => {
            return {
                pinId: pin.pinId,
                userId: pin['User.userId'],
                title: pin.title,
                image : pin.image,
                content: pin.content,
                createdAt: pin.createdAt,
                updatedAt: pin.updatedAt
            }
        });
    }

    getUserLikedPins = async (userId) => {
        const user_liked_pins = await this.usersRepository.findLikedPins(userId);
        return user_liked_pins.map((pin) => {
            return {
                likeId: pin.likeId,
                pinId: pin['Pin.pinId'],
                userId: pin['Pin.User.userId'],
                title: pin['Pin.title'],
                image : pin['Pin.image'],
                content: pin['Pin.content'],
                createdAt: pin['Pin.createdAt'],
                updatedAt: pin['Pin.updatedAt']
            }
        });
    }

    kakaoLogin = async(code) => {
        const {
            data: { access_token: kakaoAccessToken },
        } = await axios('https://kauth.kakao.com/oauth/token', {
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_REST_API_KEY,
                redirect_uri: process.env.KAKAO_REDIRECT_URI,
                code: code,
            }
        });
        const { data } = await axios('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${kakaoAccessToken}`,
            }
        });
        
        const email = data.kakao_account.email; // 검수 필요
        
        let user = await this.usersRepository.findUserbyEmail(email);

        if(!user) {
            const name = data.properties.nickname;
            const image = data.kakao_account.profile.thumbnail_image_url;
            const username = name;
            const category = "kakao";
            if(!name || !email) {
                throw new error('카카오 인증 정보가 올바르지 않습니다.');
            }
            return (user = await this.usersRepository.oauthCreateUser(
                email, name, username, image, category
                ));
        }
        const accessToken = createAccessToken(user.userId, '1h');
        const refreshToken = createRefreshToken('7D');
        return {user, accessToken, refreshToken};
    }
}

module.exports = UsersService;
