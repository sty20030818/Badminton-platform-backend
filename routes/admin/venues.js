import express from 'express'
import models from '../../models/index.js'
const { Venue, Event, User } = models
import pkg from 'http-errors'
const { NotFound } = pkg
import { success, failure } from '../../utils/responses.js'

const router = express.Router()

/**
 ** 查询场馆列表
 ** GET /admin/venues
 */
// #region 查询场馆列表
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
			order: [['id', 'ASC']],
			limit: pageSize,
			offset: offset,
			include: [
				{
					model: Event,
					as: 'events',
					// through: { attributes: [] }, // 不返回中间表的字段
					required: false, // LEFT JOIN,没有活动的场馆也会被查出来
					attributes: ['id', 'title', 'description', 'startTime', 'endTime'],
					where: {
						//* 活动开始时间大于等于当前时间
						// startTime: {
						// 	[Op.gte]: new Date(),
						// },
					},
					include: [
						{
							model: User,
							as: 'creator',
							attributes: ['id', 'username'],
						},
					],
				},
			],
		}

		//* 如果有 name 查询参数,就添加到 where 条件中
		if (query.name) {
			condition.where = {
				...condition.where,
				name: {
					[Op.like]: `%${query.name}%`,
				},
			}
		}

		//* 如果有 status 查询参数,就添加到 where 条件中
		if (query.status) {
			condition.where = {
				...condition.where,
				status: query.status,
			}
		}

		//* 查询数据
		const { count, rows } = await Venue.findAndCountAll(condition)

		//* 返回查询结果
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
 ** GET /admin/venues/:id
 */
// #region 查询场馆详情
router.get('/:id', async function (req, res) {
	try {
		const venue = await getVenue(req)

		success(res, '查询场馆成功', { venue })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 创建场馆
 ** POST /admin/venues
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
 ** 公共方法：查询当前场馆
 */
async function getVenue(reqOrId) {
	//* 获取场馆 ID
	const id = typeof reqOrId === 'object' ? reqOrId.params.id : reqOrId
	//* 查询当前场馆
	const venue = await Venue.findByPk(id, {
		include: [
			{
				model: Event,
				as: 'events',
				required: false,
				where: {
					//* 活动开始时间大于等于当前时间
					// startTime: {
					// 	[Op.gte]: new Date(),
					// },
				},
				include: [
					{
						model: User,
						as: 'creator',
						attributes: ['id', 'username'],
					},
				],
			},
		],
	})

	//* 如果没有找到,就抛出异常
	if (!venue) {
		throw new NotFound(`ID: ${id}的场馆未找到`)
	}

	return venue
}

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
