const UserRepository = require('../repositories/users.repository');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();


class UserService {
    constructor() {
        this.userRepository = new UserRepository();
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
        
        let user = await this.userRepository.findUser(email);

        if(!user) {
            return (user = await this.userRepository.signUp(name, email, picture));
        }
        console.log(user);
        return user;
    }
    // accessToken 생성
    // refreshToken 생성
}

module.exports = UserService;