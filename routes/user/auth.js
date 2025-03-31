import express from 'express'
import models from '../../models/index.js'
const { User } = models
import { Op } from 'sequelize'
import pkg from 'http-errors'
const { BadRequest, Unauthorized, NotFound } = pkg
import { success, failure } from '../../utils/responses.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

/**
 ** 用户登录
 ** POST /auth/login
 */
// #region 用户登录
router.post('/login', async (req, res) => {
	try {
		const { login, password } = req.body

		if (!login) {
			throw new BadRequest('邮箱/用户名必须填写')
		}

		if (!password) {
			throw new BadRequest('密码必须填写')
		}

		const condition = {
			where: {
				[Op.or]: [{ email: login }, { username: login }],
			},
		}

		//* 通过email或username,查询用户是否存在
		const user = await User.findOne(condition)
		if (!user) {
			throw new NotFound('用户不存在,无法登录')
		}

		//* 验证密码
		const isPasswordValid = bcrypt.compareSync(password, user.password)
		if (!isPasswordValid) {
			throw new Unauthorized('密码错误')
		}

		//* 生成身份验证令牌
		const token = jwt.sign(
			{
				userId: user.id,
			},
			process.env.SECRET,
			{ expiresIn: '1d' },
		)

		//* 返回用户信息和token
		success(res, '登录成功', { token })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 用户注册
 ** POST /auth/register
 */
// #region 用户注册
router.post('/register', async (req, res) => {
	try {
		const { username, email, password } = req.body

		//* 验证必填字段
		if (!username) {
			throw new BadRequest('用户名必须填写')
		}
		if (!email) {
			throw new BadRequest('邮箱必须填写')
		}
		if (!password) {
			throw new BadRequest('密码必须填写')
		}

		//* 验证邮箱格式
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			throw new BadRequest('邮箱格式不正确')
		}

		//* 验证密码长度
		if (password.length < 6) {
			throw new BadRequest('密码长度不能小于6位')
		}

		//* 检查用户名是否已存在
		const existingUser = await User.findOne({
			where: {
				[Op.or]: [{ username }, { email }],
			},
		})

		if (existingUser) {
			throw new BadRequest('用户名或邮箱已被注册')
		}

		//* 创建新用户
		const user = await User.create({
			username,
			email,
			password: bcrypt.hashSync(password, 10),
		})

		//* 生成身份验证令牌
		const token = jwt.sign(
			{
				userId: user.id,
			},
			process.env.SECRET,
			{ expiresIn: '1d' },
		)

		//* 返回用户信息和token
		success(res, '注册成功', {
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
		})
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

export default router
