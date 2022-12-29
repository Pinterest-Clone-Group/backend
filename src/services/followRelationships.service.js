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
        try {
            const targetUser = this.usersRepository.findUser(userId);
            if (!targetUser) {
                throw new ValidationError('No Such User Exists');
            }

            const followed = this.followRelationshipsRepository.checkFollow(userId, actorId);
            // await followservice -> followUser(userId, actorId)

            if (followed) {
                await this.followRelationshipsRepository.unFollow(userId, actorId);
            } else {
                await this.followRelationshipsRepository.addFollow(userId, actorId);
            }
            
        } catch (err) {
            next(err);
        }
    }

    getFollowers = async (userId) => {
        try {
            const targetUser = this.usersRepository.findUser(userId);
            if (!targetUser) {
                throw new ValidationError('No Such User Exists');
            }

            const followers = this.followRelationshipsRepository.getAllFollowers(userId);
            const followings = this.followRelationshipsRepository.getAllFollowings(userId);
            
            return {
                followers,
                followings
            }

        } catch (err) {
            next(err);
        }
    }
    
}

module.exports = FollowRelationshipsService ;
