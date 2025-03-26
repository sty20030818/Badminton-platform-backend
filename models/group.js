'use strict'
const { Model } = require('sequelize')
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
	class Group extends Model {
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
				through: 'group_members',
				foreignKey: 'groupId',
				otherKey: 'userId',
				as: 'members',
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

	Group.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				comment: '小组ID,主键',
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '我是个小组',
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
				comment: '小组名称,非空',
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
				defaultValue: '我是个小组描述',
				validate: {
					len: {
						args: [0, 200],
						msg: '小组描述不能超过200个字符',
					},
				},
				comment: '小组描述',
			},
			capacity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 6,
				validate: {
					notNull: {
						msg: '小组容量必须存在',
					},
					isInt: {
						msg: '小组容量必须是整数',
					},
					min: {
						args: [2],
						msg: '小组容量必须大于等于2人',
					},
					max: {
						args: [12],
						msg: '小组容量不能超过12人',
					},
				},
				comment: '小组容量,非空,默认6人',
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '公开',
				validate: {
					notNull: {
						msg: '小组状态必须存在',
					},
					notEmpty: {
						msg: '小组状态不能为空',
					},
					isIn: {
						args: [['公开', '私密', '需要申请', '关闭']],
						msg: '小组状态必须是：公开、私密、需要申请、关闭之一',
					},
				},
				comment: '小组状态：公开、私密、关闭',
			},
			eventId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '活动ID必须存在',
					},
				},
				references: {
					model: 'events',
					key: 'id',
				},
				comment: '活动ID,外键,关联events表',
			},
			creatorId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '创建者ID必须存在',
					},
				},
				references: {
					model: 'users',
					key: 'id',
				},
				comment: '创建者ID,外键,关联users表',
			},
		},
		{
			sequelize,
			modelName: 'Group',
			tableName: 'groups',
			timestamps: true,
		},
	)

	return Group
}
