const express = require('express')
const router = express.Router()
const { Venue, Event, User, EventVenue } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

/**
 * 查询场地列表
 * GET /admin/venues
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
        model: Event,
        as: 'events',
        through: { attributes: [] },  // 不返回中间表的字段
        where: {
          time: {
            [Op.gte]: new Date()  // 活动时间大于等于当前时间
          }
        },
        required: false,  // LEFT JOIN，没有活动的场馆也会被查出来
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'username']
        }]
      }]
    }

    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`,
        },
      }
    }

    const { count, rows } = await Venue.findAndCountAll(condition)

    success(res, '查询场地列表成功。', {
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

/**
 * 查询场地详情
 * GET /admin/venues/:id
 */
router.get('/:id', async function (req, res) {
  try {
    const venue = await getVenue(req)
    success(res, '查询场地成功。', { venue })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 创建场地
 * POST /admin/venues
 */
router.post('/', async function (req, res) {
  try {
    const body = filterBody(req)
    const venue = await Venue.create(body)
    success(res, '创建场地成功。', { venue }, 201)
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 更新场地
 * PUT /admin/venues/:id
 */
router.put('/:id', async function (req, res) {
  try {
    const venue = await getVenue(req)
    const body = filterBody(req)
    await venue.update(body)
    success(res, '更新场地成功。', { venue })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 删除场地
 * DELETE /admin/venues/:id
 */
router.delete('/:id', async function (req, res) {
  try {
    const venue = await getVenue(req)
    await venue.destroy()
    success(res, '删除场地成功。')
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 公共方法：查询当前场地
 */
async function getVenue(req) {
  const { id } = req.params
  const venue = await Venue.findByPk(id, {
    include: [{
      model: Event,
      as: 'events',
      through: { attributes: [] },  // 不返回中间表的字段
      where: {
        time: {
          [Op.gte]: new Date()  // 活动时间大于等于当前时间
        }
      },
      required: false,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }]
    }]
  })

  if (!venue) {
    throw new NotFoundError(`ID: ${id}的场地未找到。`)
  }

  return venue
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{
 *   name: string,
 *   location: string,
 *   description: string,
 *   status: string
 * }}
 */
function filterBody(req) {
  return {
    name: req.body.name,
    location: req.body.location,
    description: req.body.description,
    status: req.body.status
  }
}

module.exports = router
