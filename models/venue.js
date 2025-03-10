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
						msg: '场馆名称必须存在。',
					},
					notEmpty: {
						msg: '场馆名称不能为空。',
					},
					len: {
						args: [2, 50],
						msg: '场馆名称长度需要在2 ~ 50个字符之间。',
					},
				},
				comment: '场馆名称，非空',
			},
			location: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: '场馆位置必须存在。',
					},
					notEmpty: {
						msg: '场馆位置不能为空。',
					},
					len: {
						args: [2, 100],
						msg: '场馆位置长度需要在2 ~ 100个字符之间。',
					},
				},
				comment: '场馆位置，非空',
			},
			description: {
				type: DataTypes.TEXT,
				validate: {
					len: {
						args: [0, 500],
						msg: '场地详情不能超过500个字符。',
					},
				},
				comment: '场地详情',
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: '场馆状态必须存在。',
					},
					isIn: {
						args: [['可用', '维护中', '已关闭']],
						msg: '场馆状态必须是：可用、维护中、已关闭之一。',
					},
				},
				comment: '场馆状态，非空',
			},
		},
		{
			sequelize,
			modelName: 'Venue',
		}
	)
	return Venue
}
