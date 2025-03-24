'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'group_members',
			[
				{
					groupId: 1, // 休闲组
					userId: 1, // 石头鱼
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					groupId: 1,
					userId: 2, // 测试用户1
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					groupId: 2, // 对抗组
					userId: 3, // 测试用户2
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					groupId: 3, // 新手组
					userId: 2, // 测试用户1
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					groupId: 4, // 进阶组
					userId: 3, // 测试用户2
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					groupId: 5, // 高手组
					userId: 1, // 管理员
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					groupId: 6, // 精英组
					userId: 1, // 管理员
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('group_members', null, {})
	},
}
