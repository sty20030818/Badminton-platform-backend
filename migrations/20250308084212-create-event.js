'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('events', {
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '活动ID,主键',
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '活动标题,非空',
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
				defaultValue: '我是个活动描述',
				comment: '活动描述',
			},
			cover: {
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: 'eventDefault',
				comment: '活动封面图片URL',
			},
			type: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '羽毛球',
				comment: '活动类型(羽毛球,篮球,足球,乒乓球,网球,其他)',
			},
			difficulty: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
				comment: '活动难度等级,非空,范围0-5',
			},
			startTime: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL 1 DAY + INTERVAL 20 HOUR'),
				comment: '活动开始时间,非空,默认为明天20点',
			},
			endTime: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL 1 DAY + INTERVAL 22 HOUR'),
				comment: '活动结束时间,非空,默认为明天22点',
			},
			regStart: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL 1 DAY + INTERVAL 12 HOUR'),
				comment: '报名开始时间,非空,默认为明天12点',
			},
			regEnd: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL 1 DAY + INTERVAL 20 HOUR'),
				comment: '报名结束时间,非空,默认为明天20点',
			},
			capacity: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 6,
				comment: '活动容量,非空',
			},
			feeType: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '免费',
				comment: '费用类型：免费、AA制、固定费用',
			},
			feeAmount: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: true,
				defaultValue: 0,
				comment: '费用金额,当feeType为固定费用时必填',
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '公开',
				comment: '活动状态：公开、私密、需要申请',
			},
			creatorId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
				comment: '创建者ID,外键,关联users表',
			},
			venueId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: 'Venues',
					key: 'id',
				},
				comment: '场馆ID,外键,关联venues表',
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '创建时间',
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '更新时间',
			},
		})

		// 添加索引
		await queryInterface.addIndex('events', ['creatorId'])
		await queryInterface.addIndex('events', ['venueId'])
		await queryInterface.addIndex('events', ['startTime'])
		await queryInterface.addIndex('events', ['status'])
		await queryInterface.addIndex('events', ['type'])
		await queryInterface.addIndex('events', ['difficulty'])
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('events')
	},
}
