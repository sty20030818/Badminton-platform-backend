'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        comment: '小组ID，主键'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '小组名称，非空'
      },
      eventId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: '活动ID，外键，关联events表',
        references: {
          model: 'Events',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      creatorId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: '创建者ID，外键，关联users表',
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Groups');
  }
};
