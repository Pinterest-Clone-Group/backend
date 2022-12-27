const { Op } = require("sequelize");

class UsersRepository {
    // instance variable of UsersRepository class
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
    #usersModel;
    constructor (UsersModel) {
        this.#usersModel = UsersModel;
    }

    // find a user based on id
    findUser = async (userId) => {
        const target_user = await this.#usersModel.findOne({
            where: { userId }
        })
        return target_user;
    }

    // find a user based on id
    findUserbyEmail = async (email) => {
        console.log('yes - here i am')
        const target_user = await this.#usersModel.findOne({
            where: { email }
        })
        console.log(target_user)
        return target_user;
    }
    
    // create a user
    createUser = async (email, name, password, username) => {
        return await this.#usersModel.create({
            email,
            name,
            password,
            username
        });
    }
}

module.exports = UsersRepository;