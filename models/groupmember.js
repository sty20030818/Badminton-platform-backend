'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class GroupMember extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// 定义关联关系
			GroupMember.belongsTo(models.User, {
				foreignKey: 'userId',
			})
			GroupMember.belongsTo(models.Group, {
				foreignKey: 'groupId',
			})
		}
	}
	GroupMember.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '成员ID，主键',
			},
			groupId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '小组ID必须存在。',
					},
				},
				comment: '小组ID，外键，关联groups表',
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
		},
		{
			sequelize,
			modelName: 'GroupMember',
		}
	)
	return GroupMember
}
