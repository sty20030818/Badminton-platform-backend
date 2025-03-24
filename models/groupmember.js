'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class GroupMember extends Model {
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
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				comment: '成员ID，主键',
			},
			groupId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: '小组ID必须存在',
					},
				},
				references: {
					model: 'Groups',
					key: 'id',
				},
				comment: '小组ID，外键，关联groups表',
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: '用户ID必须存在',
					},
				},
				references: {
					model: 'Users',
					key: 'id',
				},
				comment: '用户ID，外键，关联users表',
			},
			joinTime: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
				comment: '加入时间，非空，默认为当前时间',
			},
		},
		{
			sequelize,
			modelName: 'GroupMember',
			tableName: 'group_members',
			timestamps: true,
			indexes: [
				{
					unique: true,
					fields: ['groupId', 'userId'],
					name: 'group_members_groupId_userId_unique',
				},
			],
		},
	)

	return GroupMember
}
