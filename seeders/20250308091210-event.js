'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Events', [
      {
        name: '江体6-8',
        description: '江体6-8 羽毛球',
        time: new Date('2024-03-08 18:00:00'),
        location: '江南体育中心',
        creatorId: 1,
        participants: 0,
        difficulty: 3,
        eventType: '羽毛球',
        registrationDeadline: new Date('2024-03-08 18:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '滨体8-10',
        description: '滨体8-10 羽毛球',
        time: new Date('2024-03-08 20:00:00'),
        location: '滨江体育馆',
        creatorId: 2,
        participants: 0,
        difficulty: 1,
        eventType: '羽毛球',
        registrationDeadline: new Date('2024-03-08 20:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {});
  }
};
