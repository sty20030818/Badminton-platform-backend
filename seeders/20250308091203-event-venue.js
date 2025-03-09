'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('EventVenues', [
      {
        eventId: 1,
        venueId: 1, // 江南体育中心
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 2,
        venueId: 2, // 滨江体育馆
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EventVenues', null, {});
  }
};
