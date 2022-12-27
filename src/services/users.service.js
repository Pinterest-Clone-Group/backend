const UsersRepository = require("../repositories/users.repository");
const { Users } = require('../models');
const { ValidationError } = require("../exceptions/index.exception");
const { hash } = require('../util/auth-encryption.util');
const { createToken } = require('../util/auth-jwtToken.util');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();


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

    kakaoLogin = async(code) => {
        const {
            data: { access_token: kakaoAccessToken },
        } = await axios('http://kauth.kakao.com/oauth/token', {
            params: {
                grant_type: 'authorization_code',
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
            return (user = await this.usersRepository.signUp(name, email, picture));
        }
        console.log(user);
        return user;
    }
}

module.exports = UsersService;
