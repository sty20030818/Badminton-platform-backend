'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Users',
			[
				{
					username: 'admin',
					nickname: '管理员',
					password: bcrypt.hashSync('123456', 10),
					email: 'admin@example.com',
					phone: '15355443674',
					gender: 1,
					avatar: 'admin',
					introduce: '系统管理员',
					role: 100,
					level: 5,
					creditScore: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					username: 'test_user1',
					nickname: '测试用户1',
					password: bcrypt.hashSync('123456', 10),
					email: 'user1@example.com',
					phone: '13800000001',
					gender: 2,
					avatar: 'user',
					introduce: '我是测试用户1',
					role: 0,
					level: 3,
					creditScore: 90,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					username: 'test_user2',
					nickname: '测试用户2',
					password: bcrypt.hashSync('123456', 10),
					email: 'user2@example.com',
					phone: '13800000002',
					gender: 0,
					avatar: 'user',
					introduce: '我是测试用户2',
					role: 0,
					level: 1,
					creditScore: 85,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Users', null, {})
	},
}
