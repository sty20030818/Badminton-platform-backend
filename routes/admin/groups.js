const express = require('express')
const router = express.Router()
const { Group, User, GroupMember } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

/**
 * 查询小组列表
 * GET /admin/groups
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
        as: 'creator',
        attributes: ['id', 'username']
      }]
    }

    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`,
        },
      }
    }

    const { count, rows } = await Group.findAndCountAll(condition)

    success(res, '查询小组列表成功。', {
      groups: rows,
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
 * 查询小组详情
 * GET /admin/groups/:id
 */
router.get('/:id', async function (req, res) {
  try {
    const group = await getGroup(req)
    success(res, '查询小组成功。', { group })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 创建小组
 * POST /admin/groups
 */
router.post('/', async function (req, res) {
  try {
    const body = {
      ...filterBody(req),
      creatorId: req.user.id  // 使用当前登录用户的ID
    }
    const group = await Group.create(body)
    success(res, '创建小组成功。', { group }, 201)
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 更新小组
 * PUT /admin/groups/:id
 */
router.put('/:id', async function (req, res) {
  try {
    const group = await getGroup(req)
    const body = filterBody(req)
    await group.update(body)
    success(res, '更新小组成功。', { group })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 删除小组
 * DELETE /admin/groups/:id
 */
router.delete('/:id', async function (req, res) {
  try {
    const group = await getGroup(req)
    await group.destroy()
    success(res, '删除小组成功。')
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 查询小组成员列表
 * GET /admin/groups/:id/members
 */
router.get('/:id/members', async function (req, res) {
  try {
    const { id } = req.params
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const members = await GroupMember.findAndCountAll({
      where: { groupId: id },
      include: [{
        model: User,
        attributes: ['id', 'username', 'email']
      }],
      order: [['id', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    // 重新格式化返回数据
    const formattedMembers = members.rows.map(member => ({
      userId: member.User.id,
      username: member.User.username,
      email: member.User.email
    }))

    success(res, '查询小组成员列表成功。', {
      members: formattedMembers,
      pagination: {
        total: members.count,
        currentPage: parseInt(page),
        pageSize: parseInt(limit)
      }
    })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 添加小组成员
 * POST /admin/groups/:id/members
 */
router.post('/:id/members', async function (req, res) {
  try {
    const { id: groupId } = req.params
    const { userId } = req.body

    // 检查小组是否存在
    const group = await Group.findByPk(groupId)
    if (!group) {
      throw new NotFoundError('小组不存在。')
    }

    // 检查用户是否存在
    const user = await User.findByPk(userId)
    if (!user) {
      throw new NotFoundError('用户不存在。')
    }

    // 检查用户是否已经是小组成员
    const existingMember = await GroupMember.findOne({
      where: { groupId, userId }
    })
    if (existingMember) {
      throw new Error('该用户已经是小组成员。')
    }

    // 创建小组成员关系
    await GroupMember.create({ groupId, userId })

    success(res, '添加小组成员成功。', null, 201)
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 移除小组成员
 * DELETE /admin/groups/:groupId/members/:userId
 */
router.delete('/:groupId/members/:userId', async function (req, res) {
  try {
    const { groupId, userId } = req.params
    const member = await GroupMember.findOne({
      where: { groupId, userId }
    })

    if (!member) {
      throw new NotFoundError('该用户不是小组成员。')
    }

    await member.destroy()
    success(res, '移除小组成员成功。')
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 公共方法：查询当前小组
 */
async function getGroup(req) {
  const { id } = req.params
  const group = await Group.findByPk(id, {
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'username']
    }]
  })

  if (!group) {
    throw new NotFoundError(`ID: ${id}的小组未找到。`)
  }

  return group
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{
 *   name: string,
 *   eventId: number
 * }}
 */
function filterBody(req) {
  return {
    name: req.body.name,
    eventId: req.body.eventId
  }
}

module.exports = router
