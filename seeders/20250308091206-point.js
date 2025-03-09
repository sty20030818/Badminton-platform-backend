'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Points', [
      {
        userId: 1,
        points: 100,
        acquiredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        points: 50,
        acquiredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        points: 30,
        acquiredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Points', null, {});
  }
};
