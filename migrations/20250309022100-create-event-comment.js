'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('event_comments', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
				comment: '评论ID，主键',
			},
			content: {
				type: Sequelize.TEXT,
				allowNull: false,
				comment: '评论内容，非空',
			},
			userId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
				comment: '用户ID，外键，关联users表',
			},
			eventId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: 'Events',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
				comment: '活动ID，外键，关联events表',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				comment: '创建时间',
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				comment: '更新时间',
			},
		})

		// 添加索引
		await queryInterface.addIndex('event_comments', ['userId'], {
			name: 'event_comments_userId_index',
		})
		await queryInterface.addIndex('event_comments', ['eventId'], {
			name: 'event_comments_eventId_index',
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('event_comments')
	},
}
