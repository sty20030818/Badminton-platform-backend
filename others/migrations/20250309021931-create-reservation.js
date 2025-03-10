'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Reservations', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
				comment: '预约ID，主键',
			},
			userId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '用户ID，外键，关联users表',
				references: {
					model: 'Users',
					key: 'id',
				},
				onUpdate: 'NO ACTION',
				onDelete: 'NO ACTION',
			},
			venueId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '场地ID，外键，关联venues表',
				references: {
					model: 'Venues',
					key: 'id',
				},
				onUpdate: 'NO ACTION',
				onDelete: 'NO ACTION',
			},
			timeslot: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '预约时间段，非空',
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '预约状态，非空',
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
		await queryInterface.addIndex('Reservations', ['userId'])
		await queryInterface.addIndex('Reservations', ['venueId'])
		await queryInterface.addIndex('Reservations', ['timeslot'])
		await queryInterface.addIndex('Reservations', ['status'])
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Reservations')
	},
}
