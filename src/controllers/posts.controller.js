const PostService = require('../services/posts.service');

class PostController{
    constructor() {
        this.postService = new PostService();
    }

    likePin = async(req, res) => {
        try{
            //const { userId } = res.locals;
            const userId = 1;
            const { pinId } = req.params;

            const result = await this.postService.likePin(userId, pinId);
            if(result === 1){
                return res.status(200).json({ message: "핀 즐겨찾기 성공" });
            }else{ // result === 0
                return res.status(200).json({ message: "핀 즐겨찾기 해제 성공" });
            }
        }catch(error){
            console.log(error);
            return res.status(400).json({ message: "핀 즐겨찾기 실패" });
        }
    }
}

module.exports = PostController;