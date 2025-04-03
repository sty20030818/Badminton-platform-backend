import express from 'express'
import models from '../../models/index.js'
const { Venue, Event, User } = models
import pkg from 'http-errors'
const { NotFound } = pkg
import { success, failure } from '../../utils/responses.js'

const router = express.Router()

/**
 ** 查询场馆列表
 ** GET /venues
 */
// #region 查询场馆列表
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
			attributes: { exclude: ['createdAt', 'updatedAt'] },
			where: {},
		}

		if (query.name) {
			condition.where.name = {
				[Op.like]: `%${query.name}%`,
			}
		}
		if (query.status) {
			condition.where.status = query.status
		}

		const { count, rows } = await Venue.findAndCountAll(condition)

		success(res, '查询场馆列表成功', {
			venues: rows,
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
 ** 查询场馆详情
 ** GET /venues/:id
 */
// #region 查询场馆详情
router.get('/:id', async function (req, res) {
	try {
		const { venue, events } = await getVenue(req)

		success(res, '查询场馆成功', { venue, events })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 创建场馆
 ** POST /venues
 */
// #region 创建场馆
router.post('/', async function (req, res) {
	try {
		const body = filterBody(req)

		//* 创建场馆
		const venue = await Venue.create(body)

		//* 重新查询场馆信息,包含关联数据
		const venueWithDetails = await getVenue(venue.id)

		success(res, '创建场馆成功', { venue: venueWithDetails }, 201)
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 更新场馆
 ** PUT /admin/venues/:id
 */
// #region 更新场馆
router.put('/:id', async function (req, res) {
	try {
		const venue = await getVenue(req)
		const body = filterBody(req)

		await venue.update(body)
		success(res, '更新场馆成功', { venue })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 删除场馆
 ** DELETE /admin/venues/:id
 */
// #region 删除场馆
router.delete('/:id', async function (req, res) {
	try {
		const venue = await getVenue(req)

		await venue.destroy()
		success(res, '删除场馆成功')
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 公共方法：获取场馆
 * @param req
 * @returns { venue, events}
 */
// #region 获取场馆
async function getVenue(req) {
	const { id } = req.params
	const venue = await Venue.findByPk(id, {
		attributes: { exclude: ['createdAt', 'updatedAt'] },
	})

	if (!venue) {
		throw new NotFound(`ID为${id}的场馆未找到`)
	}

	const events = await venue.getEvents({
		attributes: { exclude: ['venueId', 'createdAt', 'updatedAt'] },
		order: [['startTime', 'ASC']],
		include: [
			{
				model: User,
				as: 'creator',
				attributes: ['id', 'nickname', 'avatar'],
			},
		],
	})

	return { venue, events }
}
// #endregion

/**
 ** 公共方法:白名单过滤
 * @param req
 * @returns {{
 *   name: string,
 *   location: string,
 *   description: string,
 *   status: string,
 *   cover: string,
 *   latitude: number,
 *   longitude: number,
 *   openTime: string,
 *   closeTime: string,
 * }}
 */
function filterBody(req) {
	return {
		name: req.body.name,
		location: req.body.location,
		description: req.body.description,
		status: req.body.status,
		cover: req.body.cover,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		openTime: req.body.openTime,
		closeTime: req.body.closeTime,
	}
}

export default router
