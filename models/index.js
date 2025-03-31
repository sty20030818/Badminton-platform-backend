'use strict'

import Sequelize from 'sequelize'
import config from '../config/config.js'

const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env]

// 创建 Sequelize 实例
const sequelize = dbConfig.use_env_variable
	? new Sequelize(process.env[dbConfig.use_env_variable], dbConfig)
	: new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig)

// 导入模型
import User from './user.js'
import Event from './event.js'
import Venue from './venue.js'
import Group from './group.js'
import GroupMember from './groupmember.js'
import EventComment from './eventcomment.js'

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
export default {
	...models,
	sequelize,
	Sequelize,
}
