'use strict'
const { Model } = require('sequelize')
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
	class GroupMember extends Model {
		static associate(models) {
			// 定义关联关系
			GroupMember.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'user',
			})
			GroupMember.belongsTo(models.Group, {
				foreignKey: 'groupId',
				as: 'group',
			})
		}

		//* 在输出 JSON 时格式化时间
		toJSON() {
			const values = Object.assign({}, this.get())

			//* 格式化时间字段
			if (values.createdAt) {
				values.createdAt = moment(values.createdAt).format('YYYY-MM-DD HH:mm:ss')
			}
			if (values.updatedAt) {
				values.updatedAt = moment(values.updatedAt).format('YYYY-MM-DD HH:mm:ss')
			}

			return values
		}
	}

	GroupMember.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				comment: '成员ID,主键',
			},
			groupId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '小组ID必须存在',
					},
				},
				references: {
					model: 'groups',
					key: 'id',
				},
				comment: '小组ID,外键,关联groups表',
			},
			userId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '用户ID必须存在',
					},
				},
				references: {
					model: 'users',
					key: 'id',
				},
				comment: '用户ID,外键,关联users表',
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
