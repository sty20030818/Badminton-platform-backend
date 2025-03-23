'use strict'
const { Model } = require('sequelize')

// 辅助函数：转换为东八区时间
function convertToUTC8(date) {
	// 检查输入的日期是否为空，如果为空则返回null
	if (!date) return null
	// 将输入的日期字符串转换为Date对象
	const d = new Date(date)
	// 获取当前时区偏移（分钟），时区偏移是以分钟为单位的，正值表示西时区，负值表示东时区
	const timezoneOffset = d.getTimezoneOffset()
	// 转换为东八区时间（+8小时 = -480分钟的偏移）
	return new Date(d.getTime() + (timezoneOffset + 480) * 60 * 1000)
}

module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
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
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: '活动名字必须存在',
					},
					notEmpty: {
						msg: '活动名字不能为空',
					},
					len: {
						args: [2, 15],
						msg: '活动名字长度需要在2 ~ 15个字符之间',
					},
				},
				comment: '活动名称,非空',
			},
			description: {
				type: DataTypes.TEXT,
				validate: {
					len: {
						args: [0, 200],
						msg: '活动描述不能超过200个字符',
					},
				},
				comment: '活动描述',
			},
			time: {
				type: DataTypes.DATE,
				allowNull: false,
				validate: {
					notNull: {
						msg: '活动时间必须存在',
					},
					isDate: {
						msg: '请输入有效的日期时间',
					},
					isAfter: {
						args: new Date().toString(),
						msg: '活动时间必须是将来的时间',
					},
				},
				comment: '活动时间,非空',
			},
			venueId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '场地ID必须存在',
					},
					isInt: {
						msg: '场地ID必须是整数',
					},
					min: {
						args: [1],
						msg: '场地ID必须大于0',
					},
				},
				comment: '场地ID,外键,关联venues表',
			},
			creatorId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '创建者ID必须存在',
					},
					isInt: {
						msg: '创建者ID必须是整数',
					},
					min: {
						args: [1],
						msg: '创建者ID必须大于0',
					},
				},
				comment: '创建者ID,外键,关联users表',
			},
			participants: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
				validate: {
					isInt: {
						msg: '参与者数量必须是整数',
					},
					min: {
						args: [0],
						msg: '参与者数量不能小于0',
					},
					max: {
						args: [200],
						msg: '参与者数量不能超过200人',
					},
				},
				comment: '参与者数量,非空、无符号,默认值为0',
			},
			difficulty: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
				validate: {
					isInt: {
						msg: '难度等级必须是整数',
					},
					min: {
						args: [0],
						msg: '难度等级不能小于0',
					},
					max: {
						args: [10],
						msg: '难度等级不能超过10',
					},
				},
				comment: '活动难度等级,非空、无符号,默认值为0',
			},
			eventType: {
				type: DataTypes.STRING,
				validate: {
					isIn: {
						args: [['羽毛球', '篮球', '足球', '乒乓球', '网球']],
						msg: '请选择有效的活动类型',
					},
				},
				comment: '活动类型（例如：羽毛球,篮球等）',
			},
			registrationDeadline: {
				type: DataTypes.DATE,
				validate: {
					isDate: {
						msg: '请输入有效的截止日期',
					},
					isBeforeEventTime(value) {
						if (value && this.time) {
							const deadline = new Date(value)
							const eventTime = new Date(this.time)
							if (deadline > eventTime) {
								throw new Error('报名截止时间不能晚于活动开始时间')
							}
						}
					},
				},
				comment: '报名截止日期',
			},
		},
		{
			sequelize,
			modelName: 'Event',
			timestamps: true,
			hooks: {
				beforeCreate: (event) => {
					if (event.time) {
						event.time = convertToUTC8(event.time)
					}
					if (event.registrationDeadline) {
						event.registrationDeadline = convertToUTC8(event.registrationDeadline)
					}
				},
				beforeUpdate: (event) => {
					if (event.time) {
						event.time = convertToUTC8(event.time)
					}
					if (event.registrationDeadline) {
						event.registrationDeadline = convertToUTC8(event.registrationDeadline)
					}
				},
				afterFind: (events) => {
					if (!events) return
					if (Array.isArray(events)) {
						events.forEach((event) => {
							if (event.time) {
								event.time = convertToUTC8(event.time)
							}
							if (event.registrationDeadline) {
								event.registrationDeadline = convertToUTC8(event.registrationDeadline)
							}
						})
					} else {
						if (events.time) {
							events.time = convertToUTC8(events.time)
						}
						if (events.registrationDeadline) {
							events.registrationDeadline = convertToUTC8(events.registrationDeadline)
						}
					}
				},
			},
		},
	)
	return Event
}
