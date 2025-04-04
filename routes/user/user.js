import express from 'express'
import models from '../../models/index.js'
const { User } = models
import { success, failure } from '../../utils/responses.js'

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

		//* 不返回密码字段
		const userWithoutPassword = user.toJSON()
		delete userWithoutPassword.password

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
		if (req.user.role !== 100) {
			delete body.role
		}

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
 *   username: string,
 *   nickname: string,
 *   password: string,
 *   email: string,
 *   gender: number,
 *   avatar: string,
 *   introduce: string,
 * }}
 */
function filterBody(req) {
	return {
		username: req.body.username,
		nickname: req.body.nickname,
		password: req.body.password,
		email: req.body.email,
		gender: req.body.gender,
		avatar: req.body.avatar,
		introduce: req.body.introduce,
	}
}

export default router
