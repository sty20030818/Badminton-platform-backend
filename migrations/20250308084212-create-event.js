'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('events', {
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '活动ID，主键',
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '活动标题，非空',
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
				comment: '活动描述',
			},
			cover: {
				type: Sequelize.STRING,
				allowNull: true,
				comment: '活动封面图片URL',
			},
			type: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '羽毛球',
				comment: '活动类型（例如：羽毛球,篮球等）',
			},
			difficulty: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
				comment: '活动难度等级，非空，范围0-10',
			},
			startTime: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '活动开始时间，非空',
			},
			endTime: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '活动结束时间，非空',
			},
			regStart: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '报名开始时间，非空',
			},
			regEnd: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '报名结束时间，非空',
			},
			capacity: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: '活动容量，非空',
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
				comment: '费用金额，当feeType为固定费用时必填',
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
				comment: '创建者ID，外键，关联users表',
			},
			venueId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: 'Venues',
					key: 'id',
				},
				comment: '场馆ID，外键，关联venues表',
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
