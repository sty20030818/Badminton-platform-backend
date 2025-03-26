const express = require('express')
const router = express.Router()
const { Event, Venue, User, Group } = require('../../models')
const { Op } = require('sequelize')
const { NotFound } = require('http-errors')
const { success, failure } = require('../../utils/responses')

/**
 ** 查询活动列表
 ** GET /admin/events
 */
router.get('/', async function (req, res) {
	try {
		//* 获取查询参数
		const { query } = req

		//* 获取分页所需要的两个参数,currentPage 和 pageSize
		//* 如果没有传递这两个参数,就使用默认值
		//* 默认是第1页
		//* 默认每页显示 10 条数据
		const currentPage = Math.abs(Number(query.currentPage)) || 1
		const pageSize = Math.abs(Number(query.pageSize)) || 10

		//* 计算offset
		const offset = (currentPage - 1) * pageSize

		//* 定义查询条件
		const condition = {
			order: [['id', 'DESC']],
			//* 在查询条件中添加 limit 和 offset
			limit: pageSize,
			offset: offset,
			include: [
				{
					model: User,
					as: 'creator',
					// attributes: ['id', 'username', 'nickname', 'phone', 'email', 'avatar', 'introduce'],
				},
				{
					model: Venue,
					as: 'venue',
					// attributes: ['id', 'name', 'location', 'description', 'status'],
				},
				{
					model: Group,
					as: 'groups',
					// attributes: ['id', 'name', 'capacity', 'status'],
					include: [
						{
							model: User,
							as: 'creator',
							// attributes: ['id', 'nickname', 'avatar'],
						},
						{
							model: User,
							as: 'members',
							// attributes: ['id', 'nickname', 'avatar'],
							through: {
								attributes: [],
							},
						},
					],
				},
			],
			where: {},
		}
		//* 如果有 title 查询参数,就添加到 where 条件中
		if (query.title) {
			condition.where.title = {
				[Op.like]: `%${query.title}%`,
			}
		}
		if (query.venueId) {
			condition.where.venueId = query.venueId
		}
		if (query.difficulty) {
			condition.where.difficulty = query.difficulty
		}
		if (query.type) {
			condition.where.type = query.type
		}
		if (query.feeType) {
			condition.where.feeType = query.feeType
		}

		//* 查询数据
		// const events = await Event.findAll(condition);
		//* 将 findAll 方法改为 findAndCountAll 方法
		//* findAndCountAll 方法会返回一个对象,对象中有两个属性,一个是 count,一个是 rows,
		//* count 是查询到的数据的总数,rows 中才是查询到的数据
		const { count, rows } = await Event.findAndCountAll(condition)

		//* 返回查询结果
		success(res, '查询活动列表成功', {
			events: rows,
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
 ** 查询活动详情
 ** GET /admin/events/:id
 */
router.get('/:id', async function (req, res) {
	try {
		const event = await getEvent(req)

		success(res, '查询活动成功', { event })
	} catch (error) {
		failure(res, error)
	}
})

/**
 ** 创建活动
 ** POST /admin/events
 */
router.post('/', async function (req, res) {
	try {
		const body = {
			...filterBody(req),
			creatorId: req.user.id,
		}

		// 检查场地是否存在
		if (body.venueId) {
			const venue = await Venue.findByPk(body.venueId)
			if (!venue) {
				throw new NotFound(`ID: ${body.venueId}的场地未找到`)
			}
		}

		// 创建活动
		const event = await Event.create(body)

		// 重新查询活动信息,包含关联数据
		const eventWithDetails = await getEvent(event.id)

		success(res, '创建活动成功', { event: eventWithDetails }, 201)
	} catch (error) {
		failure(res, error)
	}
})

/**
 ** 更新活动
 ** PUT /admin/events/:id
 */
router.put('/:id', async function (req, res) {
	try {
		const event = await getEvent(req)
		const body = filterBody(req)

		await event.update(body)
		success(res, '更新活动成功', { event })
	} catch (error) {
		failure(res, error)
	}
})

/**
 ** 删除活动
 ** DELETE /admin/events/:id
 */
router.delete('/:id', async function (req, res) {
	try {
		const event = await getEvent(req)

		await event.destroy()
		success(res, '删除活动成功')
	} catch (error) {
		failure(res, error)
	}
})

/**
 ** 公共方法：查询当前活动
 */
async function getEvent(reqOrId) {
	//* 获取活动 ID
	const id = typeof reqOrId === 'object' ? reqOrId.params.id : reqOrId
	//* 查询当前活动
	const event = await Event.findByPk(id, {
		include: [
			{
				model: User,
				as: 'creator',
				// attributes: ['id', 'username', 'nickname', 'phone', 'email', 'avatar', 'introduce'],
			},
			{
				model: Venue,
				as: 'venue',
				// attributes: ['id', 'name', 'location', 'description', 'status'],
			},
			{
				model: Group,
				as: 'groups',
				// attributes: ['id', 'name', 'capacity', 'status'],
				include: [
					{
						model: User,
						as: 'creator',
						// attributes: ['id', 'nickname', 'avatar'],
					},
					{
						model: User,
						as: 'members',
						// attributes: ['id', 'nickname', 'avatar'],
						through: {
							attributes: [],
						},
					},
				],
			},
		],
	})

	//* 如果没有找到,就抛出异常
	if (!event) {
		throw new NotFound(`ID: ${id}的活动未找到`)
	}

	return event
}

/**
 ** 公共方法:白名单过滤
 ** @param req
 ** @returns {{
 **   title: string,
 **   description: string,
 **   cover: string,
 **   type: string,
 **   difficulty: number,
 **   startTime: Date,
 **   endTime: Date,
 **   regStart: Date,
 **   regEnd: Date,
 **   capacity: number,
 **   feeType: string,
 **   feeAmount: number,
 **   status: string,
 **   creatorId: number,
 **   venueId: number,
 ** }}
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

module.exports = router
