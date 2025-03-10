'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Venues', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
				comment: '场馆ID，主键',
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '场馆名称，非空',
			},
			location: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '场馆位置，非空',
			},
			description: {
				type: Sequelize.TEXT,
				comment: '场地详情',
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '场馆状态，非空',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})

		// 添加索引
		await queryInterface.addIndex('Venues', ['name'])
		await queryInterface.addIndex('Venues', ['status'])
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Venues')
	},
}
