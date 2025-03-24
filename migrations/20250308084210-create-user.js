'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
				comment: '用户ID，主键',
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				comment: '用户名，唯一且非空',
			},
			nickname: {
				type: Sequelize.STRING,
				comment: '昵称',
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '密码，非空',
			},
			phone: {
				type: Sequelize.STRING(11),
				allowNull: true,
				comment: '手机号，11位数字',
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				comment: '邮箱，唯一且非空',
			},
			gender: {
				type: Sequelize.TINYINT.UNSIGNED,
				allowNull: false,
				defaultValue: 2,
				comment: '性别，非空且无符号，默认值为2',
			},
			avatar: {
				type: Sequelize.STRING,
				comment: '头像',
			},
			introduce: {
				type: Sequelize.TEXT,
				comment: '个人介绍',
			},
			role: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
				comment: '用户角色，0普通用户，100管理员',
			},
			level: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
				comment: '用户等级，1-5级',
			},
			creditScore: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 100,
				comment: '信用评分，0-100分',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})

		// 添加索引
		await queryInterface.addIndex('Users', ['username'])
		await queryInterface.addIndex('Users', ['phone'])
		await queryInterface.addIndex('Users', ['email'])
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users')
	},
}
