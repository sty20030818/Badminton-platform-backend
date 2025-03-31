import express from 'express'
import models from '../../models/index.js'
const { Event, Venue, User, Group } = models
import pkg from 'http-errors'
const { NotFound } = pkg
import { success, failure } from '../../utils/responses.js'

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
		const pageSize = Math.abs(Number(query.pageSize)) || 10
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
					attributes: ['id', 'nickname', 'avatar', 'introduce'],
				},
				{
					model: Venue,
					as: 'venue',
					attributes: ['id', 'name', 'location', 'description'],
				},
				{
					model: Group,
					as: 'groups',
					attributes: ['id', 'name', 'description', 'capacity'],
					include: [
						{
							model: User,
							as: 'creator',
							attributes: ['id', 'nickname', 'avatar'],
						},
						{
							model: User,
							as: 'members',
							attributes: ['id', 'nickname', 'avatar'],
						},
					],
				},
			],
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
		const event = await getEvent(req.params.id)
		success(res, '查询活动详情成功', { event })
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
		const event = await getEvent(req.params.id)

		//* 验证是否是创建者
		if (event.creatorId !== req.user.id) {
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
		const event = await getEvent(req.params.id)

		//* 验证是否是创建者
		if (event.creatorId !== req.user.id) {
			throw new NotFound('您不是该活动的创建者,无法删除')
		}

		await event.destroy()
		success(res, '删除活动成功')
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 公共方法：获取活动
 * @param reqOrId
 * @returns {Promise<Event>}
 */
async function getEvent(reqOrId) {
	const id = typeof reqOrId === 'object' ? reqOrId.params.id : reqOrId
	const event = await Event.findByPk(id, {
		include: [
			{
				model: User,
				as: 'creator',
				attributes: ['id', 'nickname', 'avatar', 'introduce'],
			},
			{
				model: Venue,
				as: 'venue',
				attributes: ['id', 'name', 'location', 'description'],
			},
			{
				model: Group,
				as: 'groups',
				attributes: ['id', 'name', 'description', 'capacity'],
				include: [
					{
						model: User,
						as: 'creator',
						attributes: ['id', 'nickname', 'avatar'],
					},
					{
						model: User,
						as: 'members',
						attributes: ['id', 'nickname', 'avatar'],
					},
				],
			},
		],
	})

	if (!event) {
		throw new NotFound('活动不存在')
	}

	return event
}

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
