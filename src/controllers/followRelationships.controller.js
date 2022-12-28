const FollowRelationshipsService = require('../services/followRelationships.service');
const {
    InvalidParamsError,
    AuthenticationError,
} = require('../exceptions/index.exception');

class FollowRelationshipsController {
    constructor() {
        this.FollowRelationshipsService = new FollowRelationshipsService();
    }

    // API for following a user
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

    getfollowers = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { userId:actorId } = res.locals;

            if (!userId) {
                throw new InvalidParamsError;
            }

            if (!actorId) {
                throw new AuthenticationError;
            }
            
            const followers = await this.FollowRelationshipsService.getfollowers(userId);
            
            res.status(200).json({
                data: followers
            })
        } catch (err) {
            next(err);
        }
    }
}

module.exports = FollowRelationshipsController;
