const PostRepositroy = require('../services/posts.service');

class PostService{
    constructor() {
        this.postRepository = new PostRepositroy();
    }

    likePin = async(userId, pinId) => {
        const findLike = await this.postRepository.findLike(userId, pinId);
        if(findLike){
            const delLikePin = await this.postRepository.delLikePin(userId, pinId);
             return delLikePin;
        }else {
            const likePin = await this.postRepository.likePin(userId, pinId);
            return likePin;
        }
    }
}

module.exports = PostService;