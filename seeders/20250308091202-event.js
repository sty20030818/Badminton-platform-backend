'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Events',
			[
				{
					title: '3月20日江体6-8',
					description: '3月20日江体6-8 羽毛球活动，欢迎参加！',
					cover: 'event1',
					type: '羽毛球',
					difficulty: 3,
					startTime: new Date('2024-03-20 18:00:00'),
					endTime: new Date('2024-03-20 20:00:00'),
					regStart: new Date('2024-03-19 00:00:00'),
					regEnd: new Date('2024-03-19 18:00:00'),
					capacity: 20,
					feeType: '免费',
					feeAmount: 0.0,
					status: '报名中',
					creatorId: 1,
					venueId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					title: '3月20日滨体8-10',
					description: '3月20日滨体8-10 羽毛球活动，适合初学者！',
					cover: 'event2',
					type: '羽毛球',
					difficulty: 1,
					startTime: new Date('2024-03-20 20:00:00'),
					endTime: new Date('2024-03-20 22:00:00'),
					regStart: new Date('2024-03-19 00:00:00'),
					regEnd: new Date('2024-03-19 20:00:00'),
					capacity: 16,
					feeType: 'AA制',
					feeAmount: 50.0,
					status: '报名中',
					creatorId: 2,
					venueId: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					title: '3月21日星光体育馆下午场',
					description: '3月21日星光体育馆下午场，高手切磋！',
					cover: 'event3',
					type: '羽毛球',
					difficulty: 5,
					startTime: new Date('2024-03-21 14:00:00'),
					endTime: new Date('2024-03-21 16:00:00'),
					regStart: new Date('2024-03-20 00:00:00'),
					regEnd: new Date('2024-03-20 14:00:00'),
					capacity: 24,
					feeType: '固定费用',
					feeAmount: 50.0,
					status: '报名中',
					creatorId: 1,
					venueId: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Events', null, {})
	},
}
