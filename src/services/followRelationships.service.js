const FollowRelationshipsRepository = require("../repositories/followRelationships.repositories");
const UsersRepository = require("../repositories/users.repository");
const { Users, Pins, Likes, FollowRelationships } = require('../models');
const { ValidationError, AuthenticationError } = require("../exceptions/index.exception");
const { hash } = require('../util/auth-encryption.util');
const { createAccessToken, createRefreshToken } = require('../util/auth-jwtToken.util');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();


class FollowRelationshipsService {
    constructor() {
        this.usersRepository = new UsersRepository(Users);
        this.followRelationshipsRepository = new FollowRelationshipsRepository(FollowRelationships);
    }

    followUser = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { userId:actorId } = res.locals;
            
            if (!userId) {
                throw new InvalidParamsError;
            }

            if (!actorId) {
                throw new AuthenticationError;
            }

            // await followservice -> followUser(userId, actorId)

            res.status(201).json({
                message: "Follow Completed"
            })
            
        } catch (err) {
            next(err);
        }
    }

    getFollowers = async (userId) => {
        try {       
            const followers = this.followRelationshipsRepository.getAllFollowers(userId);
            if (!followers) {
                throw new ValidationError('No Such User Exists');
            }
            
            
            

        } catch (err) {
            next(err);
        }
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

        if (this.usersRepository.findUserbyEmail(email)) {
            throw new ValidationError('Already Signed Up');
        }

        const hashed_pw = hash(password);
        const name = email.substring(0, email.indexOf("@"));
        const username = name //+ Math.floor(Math.random() * 8999 + 1000).toString();
        
        const newUser = await this.usersRepository.createUser(email, name, hashed_pw, username);

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
                userId: pin['User.userId'],
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
        } = await axios('http://kauth.kakao.com/oauth/token', {
            params: {
                grant_type: 'Authorization_code',
                client_id: process.env.KAKAO_REST_API_KEY,
                redirect_uri: process.env.KAKAO_REDIRECT_URI,
                code: code,
            }
        });
        // axios 결과값 예시
        // {
        //     "token_type": "bearer",
        //     "access_token": "${ACCESS_TOKEN}",
        //     "id_token": "${ID_TOKEN}",
        //     "expires_in": 7199,
        //     "refresh_token": "${REFRESH_TOKEN}",
        //     "refresh_token_expires_in": 86399,
        //     "scope": "profile_image openid profile_nickname"
        // }

        const { data } = await axios('http://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${kakaoAccessToken}`,
            }
        });

        // OpenID Connect를 활성화 했을 경우, ID 토큰 포함
        const name = data.properties.nickname;
        const email = data.kakao_account.email; // 검수 필요
        const picture = data.kakao_account.profile.thumbnail_image_url;
        // {
        //     "aud": "${APP_KEY}",
        //     "sub": "${USER_ID}",
        //     "auth_time": 1661967952,
        //     "iss": "https://kauth.kakao.com",
        //     "exp": 1661967972,
        //     "iat": 1661967952,
        //     "nickname": "JordyTest",
        //     "picture": "http://yyy.kakao.com/.../img_110x110.jpg",
        //     "email": "jordy@kakao.com"
        // }


        if(!name || !email) {
            throw new error('카카오 인증 정보가 올바르지 않습니다.');
        }
        
        let user = await this.usersRepository.findUser(email);

        if(!user) {
            return (user = await this.usersRepository.createUser(email, name, picture));
        }
        console.log(user);
        return user;
    }
}

module.exports = FollowRelationshipsService ;
