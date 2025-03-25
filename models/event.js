'use strict'
const { Model } = require('sequelize')
const { BadRequest } = require('http-errors')
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		static associate(models) {
			//* 定义与 User 模型的关联关系
			Event.belongsTo(models.User, {
				foreignKey: 'creatorId',
				as: 'creator',
			})

			//* 定义与 Venue 模型的关联关系
			Event.belongsTo(models.Venue, {
				foreignKey: 'venueId',
				as: 'venue',
			})

			//* 定义与 EventComment 模型的关联关系
			Event.hasMany(models.EventComment, {
				foreignKey: 'eventId',
				as: 'comments',
			})
		}

		// 在输出 JSON 时格式化时间
		toJSON() {
			const values = Object.assign({}, this.get())

			// 格式化时间字段
			if (values.startTime) {
				values.startTime = moment(values.startTime).format('YYYY-MM-DD HH:mm:ss')
			}
			if (values.endTime) {
				values.endTime = moment(values.endTime).format('YYYY-MM-DD HH:mm:ss')
			}
			if (values.regStart) {
				values.regStart = moment(values.regStart).format('YYYY-MM-DD HH:mm:ss')
			}
			if (values.regEnd) {
				values.regEnd = moment(values.regEnd).format('YYYY-MM-DD HH:mm:ss')
			}
			if (values.createdAt) {
				values.createdAt = moment(values.createdAt).format('YYYY-MM-DD HH:mm:ss')
			}
			if (values.updatedAt) {
				values.updatedAt = moment(values.updatedAt).format('YYYY-MM-DD HH:mm:ss')
			}

			return values
		}
	}

	Event.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '活动ID,主键',
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: '活动标题必须存在',
					},
					notEmpty: {
						msg: '活动标题不能为空',
					},
					len: {
						args: [2, 15],
						msg: '活动标题长度需要在2 ~ 15个字符之间',
					},
				},
				comment: '活动标题,非空',
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
				defaultValue: '我是个活动描述',
				validate: {
					len: {
						args: [0, 200],
						msg: '活动描述不能超过200个字符',
					},
				},
				comment: '活动描述',
			},
			cover: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: 'eventDefault',
				comment: '活动封面图片URL',
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '羽毛球',
				validate: {
					notNull: {
						msg: '活动类型必须存在',
					},
					notEmpty: {
						msg: '活动类型不能为空',
					},
					isIn: {
						args: [['羽毛球', '篮球', '足球', '乒乓球', '网球', '其他']],
						msg: '请选择有效的活动类型',
					},
				},
				comment: '活动类型(羽毛球,篮球,足球,乒乓球,网球,其他)',
			},
			difficulty: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
				validate: {
					notNull: {
						msg: '活动难度必须存在',
					},
					isInt: {
						msg: '活动难度必须是整数',
					},
					min: {
						args: [0],
						msg: '活动难度不能小于0',
					},
					max: {
						args: [5],
						msg: '活动难度不能超过5',
					},
				},
				comment: '活动难度等级,非空,范围0-5',
			},
			startTime: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: () => {
					const tomorrow = new Date()
					tomorrow.setDate(tomorrow.getDate() + 1)
					tomorrow.setHours(20, 0, 0, 0)
					return tomorrow
				},
				validate: {
					notNull: {
						msg: '活动开始时间必须存在',
					},
					isDate: {
						msg: '请输入有效的开始时间',
					},
					isAfter: {
						args: new Date().toString(),
						msg: '活动开始时间必须是将来的时间',
					},
				},
				comment: '活动开始时间,非空,默认为明天20点',
			},
			endTime: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: () => {
					const tomorrow = new Date()
					tomorrow.setDate(tomorrow.getDate() + 1)
					tomorrow.setHours(22, 0, 0, 0)
					return tomorrow
				},
				validate: {
					notNull: {
						msg: '活动结束时间必须存在',
					},
					isDate: {
						msg: '请输入有效的结束时间',
					},
					isAfterStartTime(value) {
						if (value && this.startTime) {
							const endTime = new Date(value)
							const startTime = new Date(this.startTime)
							if (endTime <= startTime) {
								throw new BadRequest('活动结束时间必须晚于开始时间')
							}
						}
					},
				},
				comment: '活动结束时间,非空,默认为明天22点',
			},
			regStart: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: () => {
					const tomorrow = new Date()
					tomorrow.setDate(tomorrow.getDate() + 1)
					tomorrow.setHours(12, 0, 0, 0)
					return tomorrow
				},
				validate: {
					notNull: {
						msg: '报名开始时间必须存在',
					},
					isDate: {
						msg: '请输入有效的报名开始时间',
					},
					isBeforeRegEnd(value) {
						if (value && this.regEnd) {
							const startTime = new Date(value)
							const endTime = new Date(this.regEnd)
							if (startTime >= endTime) {
								throw new BadRequest('报名开始时间必须早于报名结束时间')
							}
						}
					},
				},
				comment: '报名开始时间,非空,默认为明天12点',
			},
			regEnd: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: () => {
					const tomorrow = new Date()
					tomorrow.setDate(tomorrow.getDate() + 1)
					tomorrow.setHours(20, 0, 0, 0)
					return tomorrow
				},
				validate: {
					notNull: {
						msg: '报名结束时间必须存在',
					},
					isDate: {
						msg: '请输入有效的报名结束时间',
					},
					isBeforeStartTime(value) {
						if (value && this.startTime) {
							const endTime = new Date(value)
							const startTime = new Date(this.startTime)
							if (endTime > startTime) {
								throw new BadRequest('报名结束时间必须早于活动开始时间')
							}
						}
					},
				},
				comment: '报名结束时间,非空,默认为明天20点',
			},
			capacity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 6,
				validate: {
					notNull: {
						msg: '活动容量必须存在',
					},
					isInt: {
						msg: '活动容量必须是整数',
					},
					min: {
						args: [1],
						msg: '活动容量必须大于0',
					},
					max: {
						args: [200],
						msg: '活动容量不能超过200人',
					},
				},
				comment: '活动容量,非空',
			},
			feeType: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '免费',
				validate: {
					notNull: {
						msg: '费用类型必须存在',
					},
					notEmpty: {
						msg: '费用类型不能为空',
					},
					isIn: {
						args: [['免费', 'AA制', '固定费用']],
						msg: '费用类型必须是：免费、AA制、固定费用之一',
					},
				},
				comment: '费用类型：免费、AA制、固定费用',
			},
			feeAmount: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: true,
				defaultValue: 0,
				validate: {
					isDecimal: {
						msg: '费用金额必须是数字',
					},
					min: {
						args: [0],
						msg: '费用金额不能小于0',
					},
				},
				comment: '费用金额,当feeType为fixed时必填',
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '公开',
				validate: {
					notNull: {
						msg: '活动状态必须存在',
					},
					notEmpty: {
						msg: '活动状态不能为空',
					},
					isIn: {
						args: [['公开', '私密', '需要申请']],
						msg: '活动状态必须是：公开、私密、需要申请之一',
					},
				},
				comment: '活动状态：公开、私密、需要申请',
			},
			creatorId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: '创建者ID必须存在',
					},
				},
				references: {
					model: 'Users',
					key: 'id',
				},
				comment: '创建者ID,外键,关联users表',
			},
			venueId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: '场馆ID必须存在',
					},
				},
				references: {
					model: 'Venues',
					key: 'id',
				},
				comment: '场馆ID,外键,关联venues表',
			},
		},
		{
			sequelize,
			modelName: 'Event',
			tableName: 'events',
			timestamps: true,
			indexes: [
				{
					fields: ['venueId'],
					name: 'events_venueId_index',
				},
				{
					fields: ['creatorId'],
					name: 'events_creatorId_index',
				},
				{
					fields: ['status'],
					name: 'events_status_index',
				},
			],
		},
	)

	return Event
}
