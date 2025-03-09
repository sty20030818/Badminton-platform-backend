'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Groups', [
      {
        name: '羽毛球A组',
        eventId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '羽毛球B组',
        eventId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '篮球训练小组',
        eventId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups', null, {});
  }
};
