'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Group extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// 定义关联关系
			Group.belongsTo(models.Event, {
				foreignKey: 'eventId',
				as: 'event',
			})
			Group.belongsTo(models.User, {
				foreignKey: 'creatorId',
				as: 'creator',
			})
			Group.belongsToMany(models.User, {
				through: 'GroupMembers',
				foreignKey: 'groupId',
				as: 'members',
			})
		}
	}
	Group.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '小组ID，主键',
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: '小组名称必须存在',
					},
					notEmpty: {
						msg: '小组名称不能为空',
					},
					len: {
						args: [2, 30],
						msg: '小组名称长度需要在2 ~ 30个字符之间',
					},
				},
				comment: '小组名称，非空',
			},
			eventId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '活动ID必须存在',
					},
				},
				comment: '活动ID，外键，关联events表',
			},
			creatorId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '创建者ID必须存在',
					},
				},
				comment: '创建者ID，外键，关联users表',
			},
		},
		{
			sequelize,
			modelName: 'Group',
		},
	)
	return Group
}
