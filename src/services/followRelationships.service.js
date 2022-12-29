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

    followUser = async (userId, actorId) => {
        const targetUser = this.usersRepository.findUser(userId);
        if (!targetUser) {
            throw new ValidationError('No Such User Exists');
        }

        if (userId === actorId) {
            throw new AuthenticationError('Cannot Follow Self');
        }

        const followed = await this.followRelationshipsRepository.checkFollow(userId, actorId);
        console.log(!followed)
        // console.log(followed)
        // await followservice -> followUser(userId, actorId)

        if (!followed) {
            await this.followRelationshipsRepository.addFollow(userId, actorId);
        } else {
            await this.followRelationshipsRepository.unFollow(userId, actorId);
        }

            

            // if (followed) {
            //     await this.followRelationshipsRepository.unFollow(userId, actorId);
            // } else {
            //     await this.followRelationshipsRepository.addFollow(userId, actorId);
            // }
        
    }

    getFollowers = async (userId) => {
        const targetUser = await this.usersRepository.findUser(userId);
        if (!targetUser) {
            throw new ValidationError('No Such User Exists');
        }

        const followings = await this.followRelationshipsRepository.getAllFollowings(userId);
        
        return followings;
    }
    
}

module.exports = FollowRelationshipsService ;
