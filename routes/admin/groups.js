import express from 'express'
import models from '../../models/index.js'
const { Group, User, GroupMember } = models
import pkg from 'http-errors'
const { NotFound, Conflict } = pkg
import { success, failure } from '../../utils/responses.js'
import { Op } from 'sequelize'

const router = express.Router()

/**
 ** 查询小组列表
 ** GET /admin/groups
 */
// #region 查询小组列表
router.get('/', async function (req, res) {
	try {
		const { query } = req
		const currentPage = Math.abs(Number(query.currentPage)) || 1
		const pageSize = Math.abs(Number(query.pageSize)) || 10
		const offset = (currentPage - 1) * pageSize

		const condition = {
			order: [['id', 'DESC']],
			limit: pageSize,
			offset: offset,
			include: [
				{
					model: User,
					as: 'members',
					attributes: ['id', 'nickname', 'avatar'],
					through: {
						attributes: [],
					},
				},
			],
			where: {},
		}

		if (query.name) {
			condition.where.name = {
				[Op.like]: `%${query.name}%`,
			}
		}

		const { count, rows } = await Group.findAndCountAll(condition)

		success(res, '查询小组列表成功', {
			groups: rows,
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
 ** 查询小组详情
 ** GET /admin/groups/:id
 */
// #region 查询小组详情
router.get('/:id', async function (req, res) {
	try {
		const group = await getGroup(req)
		success(res, '查询小组成功', { group })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 创建小组
 ** POST /admin/groups
 */
// #region 创建小组
router.post('/', async function (req, res) {
	try {
		const body = {
			...filterBody(req),
			creatorId: req.user.id, //* 使用当前登录用户的ID
		}
		const group = await Group.create(body)
		success(res, '创建小组成功', { group }, 201)
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 更新小组
 ** PUT /admin/groups/:id
 */
// #region 更新小组
router.put('/:id', async function (req, res) {
	try {
		const group = await getGroup(req)
		const body = filterBody(req)
		await group.update(body)
		success(res, '更新小组成功', { group })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 删除小组
 ** DELETE /admin/groups/:id
 */
// #region 删除小组
router.delete('/:id', async function (req, res) {
	try {
		const group = await getGroup(req)
		await group.destroy()
		success(res, '删除小组成功')
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 查询小组成员列表
 ** GET /admin/groups/:id/members
 */
// #region 查询小组成员列表
router.get('/:id/members', async function (req, res) {
	try {
		const { id } = req.params
		const { page = 1, limit = 10 } = req.query
		const offset = (page - 1) * limit

		const members = await GroupMember.findAndCountAll({
			where: { groupId: id },
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['id', 'username', 'email'],
				},
			],
			order: [['id', 'ASC']],
			limit: parseInt(limit),
			offset: parseInt(offset),
		})

		//* 重新格式化返回数据
		const formattedMembers = members.rows.map((member) => ({
			userId: member.user.id,
			username: member.user.username,
			email: member.user.email,
		}))

		success(res, '查询小组成员列表成功', {
			members: formattedMembers,
			pagination: {
				total: members.count,
				currentPage: parseInt(page),
				pageSize: parseInt(limit),
			},
		})
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 添加小组成员
 ** POST /admin/groups/:id/members
 */
// #region 添加小组成员
router.post('/:id/members', async function (req, res) {
	try {
		const { id: groupId } = req.params
		const { userId } = req.body

		//* 检查小组是否存在
		const group = await Group.findByPk(groupId)
		if (!group) {
			throw new NotFound('小组不存在')
		}

		//* 检查用户是否存在
		const user = await User.findByPk(userId)
		if (!user) {
			throw new NotFound('用户不存在')
		}

		//* 检查用户是否已经是小组成员
		const existingMember = await GroupMember.findOne({
			where: { groupId, userId },
		})
		if (existingMember) {
			throw new Conflict('该用户已经是小组成员')
		}

		//* 创建小组成员关系
		await GroupMember.create({ groupId, userId })

		success(res, '添加小组成员成功', null, 201)
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 移除小组成员
 ** DELETE /admin/groups/:id/members/:userId
 */
// #region 移除小组成员
router.delete('/:id/members/:userId', async function (req, res) {
	try {
		const { id: groupId, userId } = req.params

		//* 检查小组是否存在
		const group = await Group.findByPk(groupId)
		if (!group) {
			throw new NotFound('小组不存在')
		}

		//* 检查用户是否存在
		const user = await User.findByPk(userId)
		if (!user) {
			throw new NotFound('用户不存在')
		}

		//* 检查用户是否是小组成员
		const member = await GroupMember.findOne({
			where: { groupId, userId },
		})
		if (!member) {
			throw new NotFound('该用户不是小组成员')
		}

		//* 删除小组成员关系
		await member.destroy()

		success(res, '移除小组成员成功')
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 公共方法：查询当前小组
 */
async function getGroup(req) {
	const { id } = req.params
	const group = await Group.findByPk(id, {
		include: [
			{
				model: User,
				as: 'creator',
				attributes: ['id', 'username', 'email'],
			},
			{
				model: User,
				as: 'members',
				attributes: ['id', 'nickname', 'avatar'],
				through: {
					model: GroupMember,
					attributes: [],
				},
			},
		],
	})

	if (!group) {
		throw new NotFound(`ID: ${id}的小组未找到`)
	}

	return group
}

/**
 ** 公共方法：白名单过滤
 * @param req
 * @returns {{
 *   name: string,
 *   description: string,
 *   cover: string,
 *   capacity: number,
 *   status: string,
 *   creatorId: number
 * }}
 */
function filterBody(req) {
	return {
		name: req.body.name,
		description: req.body.description,
		cover: req.body.cover,
		capacity: req.body.capacity,
		status: req.body.status,
		creatorId: req.user.id,
	}
}

export default router
