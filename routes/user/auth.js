const express = require('express')
const router = express.Router()
const { User } = require('../../models')
const { Op } = require('sequelize')
const { BadRequest, Unauthorized, NotFound } = require('http-errors')
const { success, failure } = require('../../utils/responses')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 ** 用户登录
 ** POST /auth/login
 */
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
		success(res, '登录成功', { token })
	} catch (error) {
		failure(res, error)
	}
})

/**
 ** 用户注册
 ** POST /auth/register
 */
router.post('/register', async (req, res) => {
	try {
		const body = filterBody(req)
		const user = await User.create(body)

		//* 不返回密码字段
		const userWithoutPassword = user.toJSON()
		delete userWithoutPassword.password

		success(res, '注册成功', { user: userWithoutPassword }, 201)
	} catch (error) {
		failure(res, error)
	}
})

/**
 ** 公共方法：白名单过滤
 * @param req
 * @returns {{
 *   username: string,
 *   password: string,
 *   email: string,
 *   role: number
 * }}
 */
function filterBody(req) {
	return {
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		role: 0,
	}
}

module.exports = router
