import express from 'express'
import models from '../../models/index.js'
const { User } = models
import { Op } from 'sequelize'
import pkg from 'http-errors'
const { NotFound } = pkg
import { success, failure } from '../../utils/responses.js'

const router = express.Router()

/**
 ** 查询用户列表
 ** GET /admin/users
 */
// #region 查询用户列表
router.get('/', async function (req, res) {
	try {
		const { query } = req
		const currentPage = Math.abs(Number(query.currentPage)) || 1
		const pageSize = Math.abs(Number(query.pageSize)) || 10
		const offset = (currentPage - 1) * pageSize

		const condition = {
			order: [['id', 'ASC']],
			limit: pageSize,
			offset: offset,
			attributes: {
				exclude: ['password'],
			},
			where: {},
		}

		const searchFields = ['username', 'nickname', 'email', 'phone']

		searchFields.forEach((field) => {
			if (query[field]) {
				condition.where[field] = {
					[Op.like]: `%${query[field]}%`,
				}
			}
		})

		const { count, rows } = await User.findAndCountAll(condition)

		success(res, '查询用户列表成功', {
			users: rows,
			pagination: {
				total: count,
				currentPage,
				pageSize,
			},
		})
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 查询当前登录的用户详情
 ** GET /admin/users/me
 */
// #region 查询当前用户
router.get('/me', async function (req, res) {
	try {
		//* 直接使用中间件传递的用户信息
		const user = await User.findByPk(req.user.id)

		//* 不返回密码字段
		const userWithoutPassword = user.toJSON()
		delete userWithoutPassword.password

		success(res, '查询当前用户信息成功', { user: user })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 查询用户详情
 ** GET /admin/users/:id
 */
// #region 查询用户详情
router.get('/:id', async function (req, res) {
	try {
		const user = await getUser(req)
		success(res, '查询用户成功', { user })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 创建用户
 ** POST /admin/users
 */
// #region 创建用户
router.post('/', async function (req, res) {
	try {
		const body = filterBody(req)
		const user = await User.create(body)
		success(res, '创建用户成功', { user }, 201)
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 更新用户
 ** PUT /admin/users/:id
 */
// #region 更新用户
router.put('/:id', async function (req, res) {
	try {
		const user = await getUser(req)
		const body = filterBody(req)
		await user.update(body)
		success(res, '更新用户成功', { user })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 删除用户
 ** DELETE /admin/users/:id
 */
// #region 删除用户
router.delete('/:id', async function (req, res) {
	try {
		const user = await getUser(req)
		await user.destroy()
		success(res, '删除用户成功')
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 公共方法：查询当前用户
 */
async function getUser(req) {
	const { id } = req.params
	const user = await User.findByPk(id)

	if (!user) {
		throw new NotFound(`ID: ${id}的用户未找到`)
	}

	return user
}

/**
 ** 公共方法：白名单过滤
 * @param req
 * @returns {{
 *   username: string,
 *   nickname: string,
 *   password: string,
 *   phone: string,
 *   email: string,
 *   gender: number,
 *   avatar: string,
 *   introduce: string,
 *   role: number
 *   level: number
 *   creditScore: number
 * }}
 */
function filterBody(req) {
	return {
		username: req.body.username,
		nickname: req.body.nickname,
		password: req.body.password,
		phone: req.body.phone,
		email: req.body.email,
		gender: req.body.gender,
		avatar: req.body.avatar,
		introduce: req.body.introduce,
		role: req.body.role,
		level: req.body.level,
		creditScore: req.body.creditScore,
	}
}

export default router
