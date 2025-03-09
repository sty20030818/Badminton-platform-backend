'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        nickname: '管理员',
        password: '12345678',
        email: 'admin@example.com',
        gender: 1,
        avatar: 'https://example.com/avatar/admin.jpg',
        introduce: '系统管理员',
        role: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'test_user1',
        nickname: '测试用户1',
        password: '12345678',
        email: 'user1@example.com',
        gender: 1,
        avatar: 'https://example.com/avatar/user1.jpg',
        introduce: '我是测试用户1',
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'test_user2',
        nickname: '测试用户2',
        password: '12345678',
        email: 'user2@example.com',
        gender: 0,
        avatar: 'https://example.com/avatar/user2.jpg',
        introduce: '我是测试用户2',
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
