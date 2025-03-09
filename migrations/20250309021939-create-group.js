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
    await queryInterface.addIndex('Groups', ['eventId']);
    await queryInterface.addIndex('Groups', ['name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Groups');
  }
};
