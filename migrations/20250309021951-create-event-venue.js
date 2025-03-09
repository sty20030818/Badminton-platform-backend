'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EventVenues', {
      eventId: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        comment: '活动ID，外键，关联events表',
        references: {
          model: 'Events',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      venueId: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        comment: '场地ID，外键，关联venues表',
        references: {
          model: 'Venues',
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
    await queryInterface.addIndex('EventVenues', ['eventId']);
    await queryInterface.addIndex('EventVenues', ['venueId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EventVenues');
  }
};
