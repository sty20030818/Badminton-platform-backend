'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('EventParticipants', {
			eventId: {
				type: Sequelize.INTEGER.UNSIGNED,
				primaryKey: true,
				allowNull: false,
				comment: '活动ID，外键，关联events表',
				references: {
					model: 'Events',
					key: 'id',
				},
				onUpdate: 'NO ACTION',
				onDelete: 'NO ACTION',
			},
			userId: {
				type: Sequelize.INTEGER.UNSIGNED,
				primaryKey: true,
				allowNull: false,
				comment: '用户ID，外键，关联users表',
				references: {
					model: 'Users',
					key: 'id',
				},
				onUpdate: 'NO ACTION',
				onDelete: 'NO ACTION',
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
		await queryInterface.addIndex('EventParticipants', ['eventId'])
		await queryInterface.addIndex('EventParticipants', ['userId'])
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('EventParticipants')
	},
}
