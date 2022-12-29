'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FollowRelationships', {
    followId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    followerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    followingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FollowRelationships');
  },
};