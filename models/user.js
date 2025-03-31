'use strict'
import { Model } from 'sequelize'
import pkg from 'http-errors'
const { Conflict, BadRequest } = pkg
import bcrypt from 'bcryptjs'
import moment from 'moment'

export default (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// 定义关联关系
			User.hasMany(models.Event, {
				foreignKey: 'creatorId',
				as: 'createdEvents',
			})

			User.hasMany(models.Group, {
				foreignKey: 'creatorId',
				as: 'createdGroups',
			})

			User.belongsToMany(models.Group, {
				through: 'groupMember',
				foreignKey: 'userId',
				as: 'groups',
			})
		}

		// 在输出 JSON 时格式化时间
		toJSON() {
			const values = { ...this.get() }

			// 格式化时间字段
			if (values.createdAt) {
				values.createdAt = moment(values.createdAt).format('YYYY-MM-DD HH:mm:ss')
			}
			if (values.updatedAt) {
				values.updatedAt = moment(values.updatedAt).format('YYYY-MM-DD HH:mm:ss')
			}

			return values
		}
	}
	User.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '用户ID,主键',
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notNull: {
						msg: '用户名必须存在',
					},
					notEmpty: {
						msg: '用户名不能为空',
					},
					len: {
						args: [2, 20],
						msg: '用户名长度需要在2 ~ 20个字符之间',
					},
					async isUnique(value) {
						const user = await User.findOne({ where: { username: value } })
						if (user) {
							throw new Conflict('用户名已经存在')
						}
					},
				},
				comment: '用户名,唯一且非空',
			},
			nickname: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: '默认用户',
				validate: {
					len: {
						args: [0, 20],
						msg: '昵称长度不能超过20个字符',
					},
				},
				comment: '昵称',
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				set(value) {
					if (!value) {
						throw new BadRequest('密码必须填写')
					}

					if (value.length < 6 || value.length > 20) {
						throw new BadRequest('密码长度必须是6 ~ 20之间')
					}

					// 如果通过所有验证,进行hash处理并设置值
					this.setDataValue('password', bcrypt.hashSync(value, 10))
				},
				comment: '密码,非空',
			},
			phone: {
				type: DataTypes.STRING(11),
				allowNull: true,
				validate: {
					is: {
						args: /^1[3-9]\d{9}$/,
						msg: '请输入有效的手机号',
					},
					len: {
						args: [11],
						msg: '手机号必须是11位数字',
					},
				},
				comment: '手机号,11位数字',
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notNull: {
						msg: '邮箱必须存在',
					},
					isEmail: {
						msg: '请输入有效的邮箱地址',
					},
					async isUnique(value) {
						const user = await User.findOne({ where: { email: value } })
						if (user) {
							throw new Conflict('邮箱已经存在')
						}
					},
				},
				comment: '邮箱,唯一且非空',
			},
			gender: {
				type: DataTypes.TINYINT.UNSIGNED,
				allowNull: false,
				defaultValue: 2,
				validate: {
					isIn: {
						args: [[0, 1, 2]],
						msg: '性别只能是0(女)、1(男)或2(保密)',
					},
				},
				comment: '性别,非空且无符号,默认值为2',
			},
			avatar: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: 'userDefault',
				// validate: {
				// 	isUrl: {
				// 		msg: '头像必须是有效的URL地址',
				// 	},
				// },
				comment: '头像',
			},
			introduce: {
				type: DataTypes.TEXT,
				allowNull: true,
				defaultValue: '这个人很懒,什么都没有留下',
				validate: {
					len: {
						args: [0, 500],
						msg: '个人介绍不能超过500个字符',
					},
				},
				comment: '个人介绍',
			},
			role: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				validate: {
					isIn: {
						args: [[0, 100]],
						msg: '角色只能是0(普通用户)或100(管理员)',
					},
				},
				comment: '用户角色,0普通用户,100管理员',
			},
			level: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
				validate: {
					isInt: {
						msg: '等级必须是整数',
					},
					min: {
						args: [1],
						msg: '等级不能小于1',
					},
					max: {
						args: [5],
						msg: '等级不能大于5',
					},
				},
				comment: '用户等级,1-5级',
			},
			creditScore: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 80,
				validate: {
					isInt: {
						msg: '信用评分必须是整数',
					},
					min: {
						args: [0],
						msg: '信用评分不能小于0',
					},
					max: {
						args: [100],
						msg: '信用评分不能大于100',
					},
				},
				comment: '信用评分,0-100分',
			},
		},
		{
			sequelize,
			modelName: 'User',
			tableName: 'users',
			timestamps: true,
		},
	)
	return User
}
