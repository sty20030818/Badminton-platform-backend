'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'EventParticipants',
			[
				{
					eventId: 1,
					userId: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					eventId: 1,
					userId: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					eventId: 2,
					userId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		)

		// 更新活动的参与者数量
		await queryInterface.bulkUpdate('Events', { participants: 2 }, { id: 1 })
		await queryInterface.bulkUpdate('Events', { participants: 1 }, { id: 2 })
	},

	async down(queryInterface, Sequelize) {
		// 先重置参与者数量
		await queryInterface.bulkUpdate('Events', { participants: 0 }, { id: [1, 2] })
		// 然后删除参与记录
		await queryInterface.bulkDelete('EventParticipants', null, {})
	},
}
