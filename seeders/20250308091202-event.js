'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Events', [
      {
        name: '3月20日江体6-8',
        description: '3月20日江体6-8 羽毛球',
        time: new Date('2024-03-20 18:00:00'),
        creatorId: 1,
        venueId: 1,  // 江南体育中心
        participants: 0,
        difficulty: 3,
        eventType: '羽毛球',
        registrationDeadline: new Date('2024-03-20 18:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '3月20日滨体8-10',
        description: '3月20日滨体8-10 羽毛球',
        time: new Date('2024-03-20 20:00:00'),
        creatorId: 2,
        venueId: 2,  // 滨江体育馆
        participants: 0,
        difficulty: 1,
        eventType: '羽毛球',
        registrationDeadline: new Date('2024-03-20 20:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {});
  }
};
