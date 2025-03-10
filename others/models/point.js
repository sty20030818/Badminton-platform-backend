'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Point extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// 定义关联关系
			Point.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'user',
			})
		}
	}
	Point.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '积分ID，主键',
			},
			userId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '用户ID必须存在。',
					},
				},
				comment: '用户ID，外键，关联users表',
			},
			points: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '积分必须存在。',
					},
					min: {
						args: [0],
						msg: '积分不能为负数。',
					},
				},
				comment: '积分，非空、无符号',
			},
			acquiredAt: {
				type: DataTypes.DATE,
				allowNull: false,
				validate: {
					notNull: {
						msg: '获得积分时间必须存在。',
					},
					isDate: {
						msg: '请输入有效的日期时间。',
					},
				},
				comment: '获得积分时间，非空',
			},
		},
		{
			sequelize,
			modelName: 'Point',
		}
	)
	return Point
}
