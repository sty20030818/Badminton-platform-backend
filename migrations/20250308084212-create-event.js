'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Events', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
				comment: '活动ID,主键',
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '活动名称,非空',
			},
			description: {
				type: Sequelize.TEXT,
				comment: '活动描述',
			},
			time: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '活动时间,非空',
			},
			venueId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '场地ID,外键,关联venues表',
				references: {
					model: 'Venues',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			creatorId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '创建者ID,外键,关联users表',
				references: {
					model: 'Users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			participants: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
				comment: '参与者数量,非空,无符号,默认值为0',
			},
			difficulty: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
				comment: '活动难度等级,非空,无符号',
			},
			eventType: {
				type: Sequelize.STRING,
				comment: '活动类型（例如：羽毛球,篮球等）',
			},
			registrationDeadline: {
				type: Sequelize.DATE,
				comment: '报名截止日期',
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
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Events')
	},
}
