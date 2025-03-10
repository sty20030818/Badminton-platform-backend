'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Reservation extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// 定义关联关系
			Reservation.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'user',
			})
			Reservation.belongsTo(models.Venue, {
				foreignKey: 'venueId',
				as: 'venue',
			})
		}
	}
	Reservation.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '预约ID，主键',
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
			venueId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '场地ID必须存在。',
					},
				},
				comment: '场地ID，外键，关联venues表',
			},
			timeslot: {
				type: DataTypes.DATE,
				allowNull: false,
				validate: {
					notNull: {
						msg: '预约时间段必须存在。',
					},
					isDate: {
						msg: '请输入有效的日期时间。',
					},
					isAfter: {
						args: new Date().toString(),
						msg: '预约时间必须是将来的时间。',
					},
				},
				comment: '预约时间段，非空',
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: '预约状态必须存在。',
					},
					isIn: {
						args: [['待确认', '已确认', '已取消', '已完成']],
						msg: '预约状态必须是：待确认、已确认、已取消、已完成之一。',
					},
				},
				comment: '预约状态，非空',
			},
		},
		{
			sequelize,
			modelName: 'Reservation',
		}
	)
	return Reservation
}
