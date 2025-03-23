'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Groups',
			[
				{
					name: '休闲组',
					eventId: 1,
					creatorId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: '对抗组',
					eventId: 1,
					creatorId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: '休闲组',
					eventId: 2,
					creatorId: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: '对抗组',
					eventId: 2,
					creatorId: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Groups', null, {})
	},
}
