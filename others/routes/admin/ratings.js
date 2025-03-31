import express from 'express'
import models from '../../models/index.js'
const { Rating, User } = models
import { Op } from 'sequelize'
import pkg from 'http-errors'
const { NotFound } = pkg
import { success, failure } from '../../utils/responses.js'

const router = express.Router()

/**
 * 查询评分列表
 * GET /admin/ratings
 */
// #region 查询评分列表
router.get('/', async function (req, res) {
	try {
		const query = req.query
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
					as: 'rater',
					attributes: ['id', 'username'],
				},
				{
					model: User,
					as: 'rated',
					attributes: ['id', 'username'],
				},
			],
		}

		if (query.userId) {
			condition.where = {
				[Op.or]: [{ raterId: query.userId }, { ratedId: query.userId }],
			}
		}

		const { count, rows } = await Rating.findAndCountAll(condition)

		success(res, '查询评分列表成功', {
			ratings: rows,
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
 * 查询评分详情
 * GET /admin/ratings/:id
 */
// #region 查询评分详情
router.get('/:id', async function (req, res) {
	try {
		const rating = await getRating(req)
		success(res, '查询评分成功', { rating })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 * 更新评分
 * PUT /admin/ratings/:id
 */
// #region 更新评分
router.put('/:id', async function (req, res) {
	try {
		const rating = await getRating(req)
		const body = filterBody(req)
		await rating.update(body)
		success(res, '更新评分成功', { rating })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 * 删除评分
 * DELETE /admin/ratings/:id
 */
// #region 删除评分
router.delete('/:id', async function (req, res) {
	try {
		const rating = await getRating(req)
		await rating.destroy()
		success(res, '删除评分成功')
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 * 查询用户评分统计
 * GET /admin/ratings/statistics/user/:userId
 */
// #region 查询用户评分统计
router.get('/statistics/user/:userId', async function (req, res) {
	try {
		const { userId } = req.params

		const statistics = await Rating.findAll({
			attributes: [
				[sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
				[sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings'],
			],
			where: { ratedId: userId },
		})

		success(res, '查询用户评分统计成功', {
			statistics: statistics[0],
		})
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 * 公共方法：查询当前评分
 */
async function getRating(req) {
	const { id } = req.params
	const rating = await Rating.findByPk(id, {
		include: [
			{
				model: User,
				as: 'rater',
				attributes: ['id', 'username'],
			},
			{
				model: User,
				as: 'rated',
				attributes: ['id', 'username'],
			},
		],
	})

	if (!rating) {
		throw new NotFound(`ID: ${id}的评分记录未找到`)
	}

	return rating
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{
 *   raterId: number,
 *   ratedId: number,
 *   rating: number,
 *   comment: string
 * }}
 */
function filterBody(req) {
	return {
		raterId: req.body.raterId,
		ratedId: req.body.ratedId,
		rating: req.body.rating,
		comment: req.body.comment,
	}
}

export default router
