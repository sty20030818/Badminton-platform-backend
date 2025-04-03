import express from 'express'
import models from '../../models/index.js'
const { Event, Venue, User, Group, GroupMember } = models
import pkg from 'http-errors'
const { NotFound } = pkg
import { success, failure } from '../../utils/responses.js'
import { Op } from 'sequelize'

const router = express.Router()

/**
 ** 查询活动列表
 ** GET /events
 */
// #region 查询活动列表
router.get('/', async function (req, res) {
	try {
		const { query } = req
		const currentPage = Math.abs(Number(query.currentPage)) || 1
		const pageSize = Math.abs(Number(query.pageSize)) || 9
		const offset = (currentPage - 1) * pageSize

		const condition = {
			order: [['id', 'DESC']],
			limit: pageSize,
			offset: offset,
			attributes: { exclude: ['creatorId', 'venueId', 'createdAt', 'updatedAt'] },
			include: [
				{
					model: User,
					as: 'creator',
					attributes: ['id', 'nickname'],
				},
				{
					model: Venue,
					as: 'venue',
					attributes: ['id', 'name'],
				},
			],
			where: {},
		}

		//* 根据条件查询
		if (query.title) {
			condition.where.title = {
				[Op.like]: `%${query.title}%`,
			}
		}
		if (query.type) {
			condition.where.type = query.type
		}
		if (query.feeType) {
			condition.where.feeType = query.feeType
		}
		if (query.difficulty) {
			condition.where.difficulty = query.difficulty
		}
		if (query.startTime) {
			condition.where.startTime = {
				[Op.gte]: query.startTime,
			}
		}
		if (query.endTime) {
			condition.where.endTime = {
				[Op.lte]: query.endTime,
			}
		}

		//* 查询总数
		const total = await Event.count()

		//* 查询数据
		const events = await Event.findAll(condition)

		success(res, '查询活动列表成功', {
			events,
			pagination: {
				currentPage,
				pageSize,
				total,
			},
		})
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 查询活动详情
 ** GET /events/:id
 */
// #region 查询活动详情
router.get('/:id', async function (req, res) {
	try {
		const { event, creator, venue, groups } = await getEvent(req)

		success(res, '查询活动详情成功', { event, creator, venue, groups })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 创建活动
 ** POST /events
 */
// #region 创建活动
router.post('/', async function (req, res) {
	try {
		const body = filterBody(req)
		body.creatorId = req.user.id

		const event = await Event.create(body)
		success(res, '创建活动成功', { event }, 201)
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 更新活动
 ** PUT /events/:id
 */
// #region 更新活动
router.put('/:id', async function (req, res) {
	try {
		const { event, creator } = await getEvent(req)

		//* 验证是否是创建者
		if (creator.id !== req.user.id) {
			throw new NotFound('您不是该活动的创建者,无法修改')
		}

		const body = filterBody(req)
		await event.update(body)

		success(res, '更新活动成功', { event })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 删除活动
 ** DELETE /events/:id
 */
// #region 删除活动
router.delete('/:id', async function (req, res) {
	try {
		const { event, creator } = await getEvent(req)
		//* 验证是否是创建者
		if (creator.id !== req.user.id) {
			throw new NotFound('您不是该活动的创建者,无法删除')
		}

		//* 开始事务
		await models.sequelize.transaction(async (t) => {
			//* 查询该活动下的所有小组
			const groups = await Group.findAll({
				where: { eventId: event.id },
				transaction: t,
			})

			//* 删除所有小组的成员
			for (const group of groups) {
				await GroupMember.destroy({
					where: { groupId: group.id },
					transaction: t,
				})
			}

			//* 删除所有小组
			await Group.destroy({
				where: { eventId: event.id },
				transaction: t,
			})

			//* 删除活动
			await event.destroy({ transaction: t })
		})

		success(res, '删除活动成功')
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 公共方法：获取活动
 * @param req
 * @returns { event, creator, venue, groups}
 */
// #region 获取活动
async function getEvent(req) {
	const { id } = req.params
	const event = await Event.findByPk(id, {
		attributes: { exclude: ['createdAt', 'updatedAt'] },
	})

	if (!event) {
		throw new NotFound(`ID为${id}的活动未找到`)
	}

	const creator = await event.getCreator({
		attributes: ['id', 'nickname', 'avatar', 'introduce'],
	})

	const venue = await event.getVenue({
		attributes: ['id', 'name', 'location', 'description'],
	})

	const groups = await event.getGroups({
		attributes: ['id', 'name', 'description', 'capacity'],
	})

	// //* const groupCreators = await Promise.all(
	// // 	groups.map(async (group) => {
	// // 		const creator = await group.getCreator({
	// // 			attributes: ['id', 'nickname', 'avatar', 'introduce'],
	// // 		})
	// // 		return {
	// // 			groupId: group.id, // 可选：保留组的 ID
	// // 			creator: creator, // 组的创建者信息
	// // 		}
	// // 	}),
	// // )

	// //* const groupMembers = await Promise.all(
	// // 	groups.map(async (group) => {
	// // 		const members = await group.getMembers({
	// // 			attributes: ['id', 'nickname', 'avatar', 'introduce'],
	// // 		})
	// // 		return {
	// // 			groupId: group.id, // 可选：保留组的 ID
	// // 			members: members, // 组的创建者信息
	// // 		}
	// // 	}),
	// // )

	return { event, creator, venue, groups }
}
// #endregion

/**
 ** 公共方法：白名单过滤
 * @param req
 * @returns {{
 *   title: string,
 *   description: string,
 *   cover: string,
 *   type: string,
 *   difficulty: number,
 *   startTime: Date,
 *   endTime: Date,
 *   regStart: Date,
 *   regEnd: Date,
 *   capacity: number,
 *   feeType: string,
 *   feeAmount: number,
 *   status: string,
 *   venueId: number
 * }}
 */
function filterBody(req) {
	return {
		title: req.body.title,
		description: req.body.description,
		cover: req.body.cover,
		type: req.body.type,
		difficulty: req.body.difficulty,
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		regStart: req.body.regStart,
		regEnd: req.body.regEnd,
		capacity: req.body.capacity,
		feeType: req.body.feeType,
		feeAmount: req.body.feeAmount,
		status: req.body.status,
		venueId: req.body.venueId,
	}
}

export default router
