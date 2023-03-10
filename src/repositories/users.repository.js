const { Op } = require("sequelize");

class UsersRepository {
    // instance variable of UsersRepository class
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
    #usersModel;
    #pinsModel;
    #likesModel;
    constructor (UsersModel, PinsModel, LikeModel) {
        this.#usersModel = UsersModel;
        this.#pinsModel = PinsModel;
        this.#likesModel = LikeModel;
    }

    // find a user based on id
    findUser = async (userId) => {
        const target_user = await this.#usersModel.findOne({
            where: { userId }
        })
        return target_user;
    }

    // find a user based on email
    findUserbyEmail = async (email) => {
        const target_user = await this.#usersModel.findOne({
            where: { email }
        })
        console.log(target_user)
        return target_user;
    }
    
    // create a user
    createUser = async (email, name, password, username, category) => {
        return await this.#usersModel.create({
            email,
            name,
            password,
            username,
            category
        });
    }

    // oauth create user
    oauthCreateUser = async (email, name, username, image, category) => {
        console.log(category)
        return await this.#usersModel.create({
            email,
            name,
            username,
            image,
            category
        });
    }

    findCreatedPins = async (userId) => {
        const createdPinsByUser = await this.#pinsModel.findAll(
            {
                where: { userId },
                include: {
                    nested: true,
                    model: this.#usersModel,
                    as: 'User',
                    attributes: ['userId']
                },
                raw: true,
            }
        )
        return createdPinsByUser;
    }

    findLikedPins = async (userId) => {
        const likedPinsByUser = await this.#likesModel.findAll(
            {
                where: { userId },
                include: [
                    {
                        nested: true,
                        model: this.#pinsModel,
                        as: 'Pin',
                        attributes: ['pinId', 'title', 'content', 'image', 'createdAt', 'updatedAt'],
                        include: [
                            {
                                nested: true,
                                model: this.#usersModel,
                                as: 'User',
                                attributes: ['userId']
                            }
                        ]
                    },
                ],
                raw: true,
            }
        )
        return likedPinsByUser;
    }

    modifyUserProfile = async (userId, name, username, image) => {
        const modifiedUserProfile = await this.#usersModel.update(
            {
                name,
                username,
                image
            },
            { 
                where: { userId }
            }
        );
        return modifiedUserProfile;
    }
}

module.exports = UsersRepository;