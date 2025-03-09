const express = require('express')
const router = express.Router()
const { Event } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError, success, failure } = require('../../utils/response').default

/**
 ** 查询活动列表
 ** GET /admin/events
 */
router.get('/', async function (req, res) {
	try {
		//* 获取查询参数
		const query = req.query

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
		}

		//* 如果有 name 查询参数,就添加到 where 条件中
		if (query.name) {
			condition.where = {
				name: {
					[Op.like]: `%${query.name}%`,
				},
			}
		}

		//* 查询数据
		// const events = await Event.findAll(condition);
		//* 将 findAll 方法改为 findAndCountAll 方法
		//* findAndCountAll 方法会返回一个对象,对象中有两个属性,一个是 count,一个是 rows,
		//* count 是查询到的数据的总数，rows 中才是查询到的数据
		const { count, rows } = await Event.findAndCountAll(condition)

		//* 返回查询结果
		success(res, '查询活动列表成功。', {
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

		success(res, '查询活动成功。', { event })
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
		const body = filterBody(req)
		const event = await Event.create(body)

		success(res, '创建活动成功。', { event }, 201)
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
		success(res, '更新活动成功。', { event })
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
		success(res, '删除活动成功。')
	} catch (error) {
		failure(res, error)
	}
})

/**
 ** 公共方法：查询当前活动
 */
async function getEvent(req) {
	//* 获取活动 ID
	const { id } = req.params
	//* 查询当前活动
	const event = await Event.findByPk(id)

	//* 如果没有找到，就抛出异常
	if (!event) {
		throw new NotFoundError(`ID: ${id}的活动未找到。`)
	}

	return event
}

/**
 ** 公共方法:白名单过滤
 ** @param req
 ** @returns {{
 **   name: string,
 **   description: string,
 **   time: Date,
 **   location: string,
 **   creatorId: number,
 **   participants: number,
 **   difficulty: number,
 **   eventType: string,
 **   registrationDeadline: Date
 ** }}
 */
function filterBody(req) {
	return {
		name: req.body.name,
		description: req.body.description,
		time: req.body.time,
		location: req.body.location,
		creatorId: req.body.creatorId,
		participants: req.body.participants,
		difficulty: req.body.difficulty,
		eventType: req.body.eventType,
		registrationDeadline: req.body.registrationDeadline,
	}
}

module.exports = router
