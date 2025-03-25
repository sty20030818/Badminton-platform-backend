'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Points', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
				comment: '积分ID,主键',
			},
			userId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '用户ID,外键,关联users表',
				references: {
					model: 'Users',
					key: 'id',
				},
				onUpdate: 'NO ACTION',
				onDelete: 'NO ACTION',
			},
			points: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '积分,非空、无符号',
			},
			acquiredAt: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '获得积分时间,非空',
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
		await queryInterface.addIndex('Points', ['userId'])
		await queryInterface.addIndex('Points', ['acquiredAt'])
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Points')
	},
}
