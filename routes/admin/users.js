const express = require('express')
const router = express.Router()
const { User } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')

/**
 * 查询用户列表
 * GET /admin/users
 */
router.get('/', async function (req, res) {
	try {
		const query = req.query
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

/**
 * 创建用户
 * POST /admin/users
 */
router.post('/', async function (req, res) {
	try {
		const body = filterBody(req)
		const user = await User.create(body)
		success(res, '创建用户成功', { user }, 201)
	} catch (error) {
		failure(res, error)
	}
})

/**
 * 查询用户详情
 * GET /admin/users/:id
 */
router.get('/:id', async function (req, res) {
	try {
		const user = await getUser(req)
		success(res, '查询用户成功', { user })
	} catch (error) {
		failure(res, error)
	}
})

/**
 * 更新用户
 * PUT /admin/users/:id
 */
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

/**
 * 删除用户
 * DELETE /admin/users/:id
 */
router.delete('/:id', async function (req, res) {
	try {
		const user = await getUser(req)
		await user.destroy()
		success(res, '删除用户成功')
	} catch (error) {
		failure(res, error)
	}
})

/**
 * 公共方法：查询当前用户
 */
async function getUser(req) {
	const { id } = req.params
	const user = await User.findByPk(id)

	if (!user) {
		throw new NotFoundError(`ID: ${id}的用户未找到`)
	}

	return user
}

/**
 * 公共方法：白名单过滤
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
		nickname: req.body.nickname || '用户',
		password: req.body.password,
		phone: req.body.phone,
		email: req.body.email,
		gender: req.body.gender || 2,
		avatar: req.body.avatar || 'user',
		introduce: req.body.introduce || '这个人很懒，什么都没有留下',
		role: req.body.role || 0,
		level: req.body.level || 1,
		creditScore: req.body.creditScore || 100,
	}
}

module.exports = router
