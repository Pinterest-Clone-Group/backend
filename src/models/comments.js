'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Users, { foreignKey: 'userId' });
            this.belongsTo(models.Pins, { foreignKey: 'pinId' });
            this.hasMany(models.CommentLikes, {
                as: 'CommentLikes',
                foreignKey: 'commentId',
            });
        }
    }
    Comments.init(
        {
            commentId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            pinId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Pins',
                    key: 'pinId',
                },
                onDelete: 'cascade',
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'userId',
                },
                onDelete: 'cascade',
            },
            comment: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            like: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            parentCommentId: {
                allowNull: true,
                type: DataTypes.INTEGER,
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
            modelName: 'Comments',
        }
    );
    return Comments;
};