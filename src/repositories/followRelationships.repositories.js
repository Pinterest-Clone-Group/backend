const { sequelize } = require('../models');

class FollowRelationshipsRepository {
    // instance variable of UsersRepository class
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
    #followRelationshipsModel;
    constructor (FollowRelationshipsModel) {
        this.#followRelationshipsModel = FollowRelationshipsModel;
    }

    getAllFollowers = async (userId) => {
        const query = `
        SELECT userId, name, image
        FROM Users 
        INNER JOIN (
            SELECT followerId AS myFollowerUserId FROM FollowRelationships WHERE followingId =$followingId 
            ) as followerData
        ON Users.userId = followerData.myFollowerUserId`;

        const data = await sequelize.query(query, {
            bind: { followingId: userId },
            type: sequelize.QueryTypes.SELECT,
        });
        return data;
    }

    getAllFollowings = async (userId) => {
        const query = `
        SELECT userId, name, image 
        FROM Users 
        INNER JOIN (
            SELECT followingId AS myFollowingUserId FROM FollowRelationships WHERE followerId =$followerId
            ) as followingData
        ON Users.userId = followingData.myFollowingUserId`;

        const data = await sequelize.query(query, {
            bind: { followerId: userId },
            type: sequelize.QueryTypes.SELECT,
        });
        return data;
    }

    checkFollow = async (targetUserId, userId) => {
        const targetFollow = await this.#followRelationshipsModel.findOne({
            where: { 
                followingId: Number(targetUserId), 
                followerId: userId 
            },
        });
        console.log(targetFollow)
        return targetFollow;
    };

    addFollow = async (targetUserId, userId) => {
        await this.#followRelationshipsModel.create({
                followingId: Number(targetUserId), 
                followerId: userId 
        });
    };

    unFollow = async (targetUserId, userId) => {
        await this.#followRelationshipsModel.destroy({
            where: { 
                followingId: Number(targetUserId), 
                followerId: userId
            },
        });
    };

}

module.exports = FollowRelationshipsRepository;