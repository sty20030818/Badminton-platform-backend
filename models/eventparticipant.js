'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class EventParticipant extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// 定义关联关系
			// 这是一个关联表，主要关联关系已在 User 和 Event 模型中定义
		}
	}
	EventParticipant.init(
		{
			eventId: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				allowNull: false,
				validate: {
					notNull: {
						msg: '活动ID必须存在',
					},
				},
				comment: '活动ID，外键，关联events表',
			},
			userId: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				allowNull: false,
				validate: {
					notNull: {
						msg: '用户ID必须存在',
					},
				},
				comment: '用户ID，外键，关联users表',
			},
		},
		{
			sequelize,
			modelName: 'EventParticipant',
		},
	)
	return EventParticipant
}
