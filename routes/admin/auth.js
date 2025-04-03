import express from 'express'
import models from '../../models/index.js'
const { User } = models
import { Op } from 'sequelize'
import pkg from 'http-errors'
const { BadRequest, Unauthorized, NotFound } = pkg
import { success, failure } from '../../utils/responses.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
//* const crypto = require('crypto')

const router = express.Router()

/**
 ** 管理员登录
 ** POST /admin/auth/login
 */
// #region 管理员登录
router.post('/login', async (req, res) => {
	try {
		//* console.log(crypto.randomBytes(32).toString('hex'))
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

		//* 验证是否管理员
		if (user.role !== 100) {
			throw new Unauthorized('您没有权限登录管理员后台')
		}

		//* 生成身份验证令牌
		const token = jwt.sign(
			{
				userId: user.id,
			},
			process.env.SECRET,
			{ expiresIn: '7d' },
		)
		success(res, '登录成功', { token })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

export default router
