'use strict'

const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

// 创建 Sequelize 实例
const sequelize = config.use_env_variable
	? new Sequelize(process.env[config.use_env_variable], config)
	: new Sequelize(config.database, config.username, config.password, config)

// 导入模型
const User = require('./user')
const Event = require('./event')
const Venue = require('./venue')
const Group = require('./group')
const GroupMember = require('./groupmember')
const EventComment = require('./eventcomment')

// 初始化所有模型
const models = {
	User: User(sequelize, Sequelize.DataTypes),
	Event: Event(sequelize, Sequelize.DataTypes),
	Venue: Venue(sequelize, Sequelize.DataTypes),
	Group: Group(sequelize, Sequelize.DataTypes),
	GroupMember: GroupMember(sequelize, Sequelize.DataTypes),
	EventComment: EventComment(sequelize, Sequelize.DataTypes),
}

// 建立模型之间的关联关系
Object.values(models).forEach((model) => {
	if (model.associate) {
		model.associate(models)
	}
})

// 导出模型和 Sequelize 实例
module.exports = {
	...models,
	sequelize,
	Sequelize,
}
