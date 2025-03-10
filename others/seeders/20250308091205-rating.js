'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Ratings',
			[
				{
					userId: 1,
					ratedUserId: 2,
					rating: 5,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					userId: 2,
					ratedUserId: 1,
					rating: 4,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					userId: 3,
					ratedUserId: 1,
					rating: 5,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					userId: 2,
					ratedUserId: 3,
					rating: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Ratings', null, {})
	},
}
