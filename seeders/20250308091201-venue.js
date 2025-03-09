'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Venues', [
      {
        name: '江南体育中心',
        location: '杭州市滨江区江南大道100号',
        description: '设施完善，交通便利，环境优美',
        status: '可用',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '滨江体育馆',
        location: '杭州市滨江区滨盛路200号',
        description: '专业羽毛球场地，灯光充足',
        status: '可用',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '星光体育馆',
        location: '杭州市滨江区星光大道300号',
        description: '多功能运动场馆，配套设施齐全',
        status: '维护中',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Venues', null, {});
  }
};
