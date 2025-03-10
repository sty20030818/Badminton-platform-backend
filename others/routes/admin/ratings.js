const express = require('express')
const router = express.Router()
const { Rating, User } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')

/**
 * 查询评分列表
 * GET /admin/ratings
 */
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

		success(res, '查询评分列表成功。', {
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

/**
 * 查询评分详情
 * GET /admin/ratings/:id
 */
router.get('/:id', async function (req, res) {
	try {
		const rating = await getRating(req)
		success(res, '查询评分成功。', { rating })
	} catch (error) {
		failure(res, error)
	}
})

/**
 * 更新评分
 * PUT /admin/ratings/:id
 */
router.put('/:id', async function (req, res) {
	try {
		const rating = await getRating(req)
		const body = filterBody(req)
		await rating.update(body)
		success(res, '更新评分成功。', { rating })
	} catch (error) {
		failure(res, error)
	}
})

/**
 * 删除评分
 * DELETE /admin/ratings/:id
 */
router.delete('/:id', async function (req, res) {
	try {
		const rating = await getRating(req)
		await rating.destroy()
		success(res, '删除评分成功。')
	} catch (error) {
		failure(res, error)
	}
})

/**
 * 查询用户评分统计
 * GET /admin/ratings/statistics/user/:userId
 */
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

		success(res, '查询用户评分统计成功。', { statistics: statistics[0] })
	} catch (error) {
		failure(res, error)
	}
})

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
		throw new NotFoundError(`ID: ${id}的评分记录未找到。`)
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

module.exports = router
