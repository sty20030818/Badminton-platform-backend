'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'event_comments',
			[
				{
					content: '这个活动很不错,场地很好,推荐参加！',
					userId: 2,
					eventId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					content: '组织得很好,希望能多举办这样的活动。',
					userId: 3,
					eventId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					content: '适合新手参加,氛围很好。',
					userId: 2,
					eventId: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					content: '场地设施很完善,下次还会来。',
					userId: 1,
					eventId: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('event_comments', null, {})
	},
}
