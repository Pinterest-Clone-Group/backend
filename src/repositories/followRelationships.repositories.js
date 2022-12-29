const { Op } = require("sequelize");

class FollowRelationshipsRepository {
    // instance variable of UsersRepository class
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
    #usersModel;
    #followRelationshipsModel;
    constructor (UsersModel, FollowRelationshipsModel) {
        this.#usersModel = UsersModel;
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
            SELECT followingId AS myFollowingUserId FROM FollowRelationships WHERE follwerId =$followerId
            ) as followingData
        ON Users.userId = followingData.myFollowingUserId`;

        const data = await sequelize.query(query, {
            bind: { followerId: userId },
            type: sequelize.QueryTypes.SELECT,
        });
        return data;
    }

    checkFollow = async (targetUserId, userId) => {
        return this.#followRelationshipsModel.findOne({
            where: { 
                followingId: targetUserId, 
                followerId: userId 
            },
        });
    };

    addFollow = async (targetUserId, userId) => {
        await this.#followRelationshipsModel.create({
                followingId: targetUserId, 
                followerId: userId 
        });
    };

    unFollow = async (targetUserId, userId) => {
        await this.#followRelationshipsModel.destroy({
            where: { 
                followingId: targetUserId, 
                followerId: userId
            },
        });
    };

}

module.exports = FollowRelationshipsRepository;