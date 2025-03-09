'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        comment: '成员ID，主键'
      },
      groupId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: '小组ID，外键，关联groups表',
        references: {
          model: 'Groups',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: '用户ID，外键，关联users表',
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
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

    // 添加索引
    await queryInterface.addIndex('GroupMembers', ['groupId']);
    await queryInterface.addIndex('GroupMembers', ['userId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GroupMembers');
  }
};
