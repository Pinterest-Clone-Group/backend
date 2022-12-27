const UserService = require('../services/users.service');

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    kakaoLogin = async(req, res) => {
        try{
            const { code } = req.query;
            if(!code) {
                throw new error('카카오 로그인에 실패하였습니다.');
            }

            const user = await this.userService.kakaoLogin(code);
            const accessToken = await this.userService.createAccessToken(
                user.userId
            );
            const refreshToken = await this.userService.createRefreshToken(
                user.userId
            );
            window.close();
            return res
                .header({ accessToken, refreshToken })
                .status(200)
                .json({
                    message: `${user.name}님의 로그인이 완료 되었습니다.`
                });
        }catch(error){
            console.log(error);
            return res.status(400).json({ message: "알 수 없는 에러입니다."});
        }
    }
}

module.exports = UserController;