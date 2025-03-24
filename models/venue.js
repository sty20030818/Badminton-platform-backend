'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Venue extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// 定义关联关系
			Venue.hasMany(models.Event, {
				foreignKey: 'venueId',
				as: 'events',
			})
		}
	}
	Venue.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '场馆ID，主键',
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: '场馆名称必须存在',
					},
					notEmpty: {
						msg: '场馆名称不能为空',
					},
					len: {
						args: [2, 50],
						msg: '场馆名称长度需要在2 ~ 50个字符之间',
					},
				},
				comment: '场馆名称，非空',
			},
			location: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: '场馆位置必须存在',
					},
					notEmpty: {
						msg: '场馆位置不能为空',
					},
					len: {
						args: [2, 100],
						msg: '场馆位置长度需要在2 ~ 100个字符之间',
					},
				},
				comment: '场馆位置，非空',
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
				validate: {
					len: {
						args: [0, 500],
						msg: '场馆描述不能超过500个字符',
					},
				},
				comment: '场馆描述',
			},
			cover: {
				type: DataTypes.STRING,
				allowNull: true,
				comment: '场馆封面图片URL',
			},
			latitude: {
				type: DataTypes.DECIMAL(10, 6),
				allowNull: true,
				validate: {
					isDecimal: {
						msg: '纬度必须是数字',
					},
					min: {
						args: [-90],
						msg: '纬度不能小于-90',
					},
					max: {
						args: [90],
						msg: '纬度不能大于90',
					},
				},
				comment: '场馆纬度',
			},
			longitude: {
				type: DataTypes.DECIMAL(10, 6),
				allowNull: true,
				validate: {
					isDecimal: {
						msg: '经度必须是数字',
					},
					min: {
						args: [-180],
						msg: '经度不能小于-180',
					},
					max: {
						args: [180],
						msg: '经度不能大于180',
					},
				},
				comment: '场馆经度',
			},
			openTime: {
				type: DataTypes.TIME,
				allowNull: false,
				defaultValue: '08:00:00',
				validate: {
					isTime: (value) => {
						if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value)) {
							throw new Error('请输入有效的开放时间，格式为HH:mm:ss')
						}
					},
				},
				comment: '场馆开放时间，格式HH:mm:ss',
			},
			closeTime: {
				type: DataTypes.TIME,
				allowNull: false,
				defaultValue: '22:00:00',
				validate: {
					isTime: (value) => {
						if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value)) {
							throw new Error('请输入有效的关闭时间，格式为HH:mm:ss')
						}
					},
					isAfterOpenTime(value) {
						if (value && this.openTime) {
							const close = value.split(':').map(Number)
							const open = this.openTime.split(':').map(Number)
							const closeSeconds = close[0] * 3600 + close[1] * 60 + close[2]
							const openSeconds = open[0] * 3600 + open[1] * 60 + open[2]
							if (closeSeconds <= openSeconds) {
								throw new Error('关闭时间必须晚于开放时间')
							}
						}
					},
				},
				comment: '场馆关闭时间，格式HH:mm:ss',
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: '场馆状态必须存在',
					},
					isIn: {
						args: [['可用', '维护中', '已关闭']],
						msg: '场馆状态必须是：可用、维护中、已关闭之一',
					},
				},
				comment: '场馆状态，非空',
			},
		},
		{
			sequelize,
			modelName: 'Venue',
		},
	)
	return Venue
}
