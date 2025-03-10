const express = require('express')
const router = express.Router()
const { Point, User } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

/**
 * 查询积分列表
 * GET /admin/points
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
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    }

    if (query.userId) {
      condition.where = {
        userId: query.userId
      }
    }

    const { count, rows } = await Point.findAndCountAll(condition)

    success(res, '查询积分列表成功。', {
      points: rows,
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
 * 查询积分详情
 * GET /admin/points/:id
 */
router.get('/:id', async function (req, res) {
  try {
    const point = await getPoint(req)
    success(res, '查询积分成功。', { point })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 添加积分
 * POST /admin/points
 */
router.post('/', async function (req, res) {
  try {
    const body = filterBody(req)
    const point = await Point.create(body)
    success(res, '添加积分成功。', { point }, 201)
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 更新积分
 * PUT /admin/points/:id
 */
router.put('/:id', async function (req, res) {
  try {
    const point = await getPoint(req)
    const body = filterBody(req)
    await point.update(body)
    success(res, '更新积分成功。', { point })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 删除积分
 * DELETE /admin/points/:id
 */
router.delete('/:id', async function (req, res) {
  try {
    const point = await getPoint(req)
    await point.destroy()
    success(res, '删除积分成功。')
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 查询积分排行榜
 * GET /admin/points/leaderboard
 */
router.get('/leaderboard/top', async function (req, res) {
  try {
    const { limit = 10 } = req.query

    const leaderboard = await User.findAll({
      attributes: [
        'id',
        'username',
        [sequelize.fn('SUM', sequelize.col('Points.points')), 'totalPoints']
      ],
      include: [{
        model: Point,
        attributes: []
      }],
      group: ['User.id'],
      order: [[sequelize.literal('totalPoints'), 'DESC']],
      limit: parseInt(limit)
    })

    success(res, '查询积分排行榜成功。', { leaderboard })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 公共方法：查询当前积分记录
 */
async function getPoint(req) {
  const { id } = req.params
  const point = await Point.findByPk(id, {
    include: [{
      model: User,
      attributes: ['id', 'username']
    }]
  })

  if (!point) {
    throw new NotFoundError(`ID: ${id}的积分记录未找到。`)
  }

  return point
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{
 *   userId: number,
 *   points: number,
 *   description: string,
 *   acquiredAt: Date
 * }}
 */
function filterBody(req) {
  return {
    userId: req.body.userId,
    points: req.body.points,
    description: req.body.description,
    acquiredAt: req.body.acquiredAt || new Date()
  }
}

module.exports = router
