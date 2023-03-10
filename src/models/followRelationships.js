'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FollowRelationships extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    FollowRelationships.init(
        {
            followId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            followerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            followingId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'FollowRelationships',
        }
    );
    return FollowRelationships;
};
