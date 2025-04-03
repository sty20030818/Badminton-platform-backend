/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Groups',
			[
				{
					name: '休闲组1',
					description: '适合初学者和休闲玩家',
					capacity: 6,
					status: '公开',
					eventId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: '对抗组1',
					description: '适合有一定基础的玩家',
					capacity: 6,
					status: '公开',
					eventId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: '休闲组2',
					description: '适合新手玩家',
					capacity: 6,
					status: '公开',
					eventId: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: '对抗组2',
					description: '适合有基础的玩家',
					capacity: 6,
					status: '公开',
					eventId: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: '新手组',
					description: '适合完全新手',
					capacity: 6,
					status: '私密',
					eventId: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: '高手组',
					description: '适合专业级玩家',
					capacity: 6,
					status: '私密',
					eventId: 3,
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
