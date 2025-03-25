'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Ratings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
				comment: '评分ID,主键',
			},
			userId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '评分用户ID,外键,关联users表',
				references: {
					model: 'Users',
					key: 'id',
				},
				onUpdate: 'NO ACTION',
				onDelete: 'NO ACTION',
			},
			ratedUserId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '被评分用户ID,外键,关联users表',
				references: {
					model: 'Users',
					key: 'id',
				},
				onUpdate: 'NO ACTION',
				onDelete: 'NO ACTION',
			},
			rating: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '评分,非空、无符号',
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
		await queryInterface.addIndex('Ratings', ['userId'])
		await queryInterface.addIndex('Ratings', ['ratedUserId'])
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Ratings')
	},
}
