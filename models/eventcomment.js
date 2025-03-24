'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
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
	}

	EventComment.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				comment: '评论ID，主键',
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
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
				comment: '评论内容，非空',
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
			eventId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: '活动ID必须存在',
					},
				},
				references: {
					model: 'Events',
					key: 'id',
				},
				comment: '活动ID，外键，关联events表',
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
