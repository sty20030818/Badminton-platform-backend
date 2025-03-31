'use strict'
import { Model } from 'sequelize'
import moment from 'moment'

export default (sequelize, DataTypes) => {
	class EventComment extends Model {
		static associate(models) {
			// 定义关联关系
			EventComment.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'user',
			})
			EventComment.belongsTo(models.Event, {
				foreignKey: 'eventId',
				as: 'event',
			})
		}

		//* 在输出 JSON 时格式化时间
		toJSON() {
			const values = { ...this.get() }

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

	EventComment.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				comment: '评论ID,主键',
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
				defaultValue: '我是个评论',
				validate: {
					notNull: {
						msg: '评论内容必须存在',
					},
					notEmpty: {
						msg: '评论内容不能为空',
					},
					len: {
						args: [1, 500],
						msg: '评论内容长度需要在1 ~ 500个字符之间',
					},
				},
				comment: '评论内容,非空',
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
		},
		{
			sequelize,
			modelName: 'EventComment',
			tableName: 'event_comments',
			timestamps: true,
			indexes: [
				{
					fields: ['userId'],
					name: 'event_comments_userId_index',
				},
				{
					fields: ['eventId'],
					name: 'event_comments_eventId_index',
				},
			],
		},
	)

	return EventComment
}
