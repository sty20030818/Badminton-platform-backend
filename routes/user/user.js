import express from 'express'
import models from '../../models/index.js'
const { User } = models
import { success, failure } from '../../utils/responses.js'
import bcrypt from 'bcryptjs'
import pkg from 'http-errors'
const { BadRequest } = pkg

const router = express.Router()

/**
 ** 查询当前用户详情
 ** GET /user/me
 */
// #region 查询当前用户详情
router.get('/me', async function (req, res) {
	try {
		//* 直接使用中间件传递的用户信息
		const user = await User.findByPk(req.user.id)

		//* 不返回密码和权限字段
		const userWithoutPassword = user.toJSON()
		delete userWithoutPassword.password
		delete userWithoutPassword.role

		success(res, '查询用户成功', { user: userWithoutPassword })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 更新当前用户
 ** PUT /user/me
 */
// #region 更新当前用户
router.put('/me', async function (req, res) {
	try {
		const user = await User.findByPk(req.user.id)
		const body = filterBody(req)

		//* 普通用户不能修改role字段
		// if (req.user.role !== 100) {
		// 	delete body.role
		// }

		await user.update(body)

		//* 不返回密码字段
		const userWithoutPassword = user.toJSON()
		delete userWithoutPassword.password

		success(res, '更新用户成功', { user: userWithoutPassword })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 更新当前用户密码
 ** PUT /user/me/password
 */
// #region 更新当前用户密码
router.put('/me/password', async function (req, res) {
	try {
		const { oldPassword, newPassword } = req.body

		// 验证必填字段
		if (!oldPassword) {
			throw new BadRequest('旧密码必须填写')
		}
		if (!newPassword) {
			throw new BadRequest('新密码必须填写')
		}

		// 验证新密码不能与当前密码相同
		if (oldPassword === newPassword) {
			throw new BadRequest('新密码不能与旧密码相同')
		}

		const user = await User.findByPk(req.user.id)

		// 验证当前密码是否正确
		const isPasswordValid = bcrypt.compareSync(oldPassword, user.password)
		if (!isPasswordValid) {
			throw new BadRequest('旧密码错误')
		}

		// 更新密码
		await user.update({ password: newPassword })

		success(res, '更新用户密码成功')
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 删除当前用户
 ** DELETE /user/me
 */
// #region 删除当前用户
router.delete('/me', async function (req, res) {
	try {
		const user = await User.findByPk(req.user.id)
		await user.destroy()
		success(res, '删除用户成功')
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 公共方法：白名单过滤
 * @param req
 * @returns {{
 *   nickname: string,
 *   phone: string,
 *   email: string,
 *   gender: number,
 *   avatar: string,
 *   introduce: string,
 *   level: number,
 * }}
 */
function filterBody(req) {
	return {
		nickname: req.body.nickname,
		phone: req.body.phone,
		email: req.body.email,
		gender: req.body.gender,
		avatar: req.body.avatar,
		introduce: req.body.introduce,
		level: req.body.level,
	}
}

export default router
