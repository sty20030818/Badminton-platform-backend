import express from 'express'
import models from '../../models/index.js'
const { Group, User, GroupMember, Event } = models
import pkg from 'http-errors'
const { NotFound, Conflict } = pkg
import { success, failure } from '../../utils/responses.js'

const router = express.Router()
/**
 ** 查询小组详情
 ** GET /groups/:id
 */
// #region 查询小组详情
router.get('/:id', async function (req, res) {
	try {
		const { group, members } = await getGroup(req)
		success(res, '查询小组成功', { group, members })
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 创建小组
 ** POST /groups
 */
// #region 创建小组
router.post('/', async function (req, res) {
	try {
		const body = filterBody(req)

		//* 查询活动信息
		const event = await Event.findByPk(body.eventId)
		if (!event) {
			throw new NotFound('找不到对应的活动')
		}

		//* 创建小组
		const group = await Group.create(body)
		const groupCapacity = parseInt(body.capacity, 10) || 0 // 将 capacity 转换为整数

		//* 更新活动容量
		await event.update({
			capacity: event.capacity + groupCapacity,
		})

		success(res, '创建小组成功', { group }, 201)
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 加入/退出小组
 ** POST /groups/:id/join
 */
// #region 加入退出小组
router.post('/:id/join', async function (req, res) {
	try {
		const { id: groupId } = req.params
		const { id: userId } = req.user

		//* 检查小组是否存在
		const group = await Group.findByPk(groupId)
		if (!group) {
			throw new NotFound('小组不存在')
		}

		//* 检查用户是否存在
		const user = await User.findByPk(userId)
		if (!user) {
			throw new NotFound('用户不存在')
		}

		//* 检查用户是否已经是当前小组成员
		const existingMember = await GroupMember.findOne({
			where: { groupId, userId },
		})

		//* 查询活动信息
		const event = await Event.findByPk(group.eventId)
		if (!event) {
			throw new NotFound('活动不存在')
		}

		if (existingMember) {
			//* 如果已经是成员,则退出小组
			await existingMember.destroy()
			//* 更新活动报名人数
			await event.update({
				registeredCount: event.registeredCount - 1,
			})
			success(res, '退出小组成功')
		} else {
			//* 如果不是成员,则检查用户是否在其他小组中
			const otherGroupMember = await GroupMember.findOne({
				where: { userId },
				include: [
					{
						model: Group,
						as: 'group',
						where: { eventId: group.eventId },
						attributes: ['id', 'name'],
					},
				],
			})

			if (otherGroupMember) {
				//* 如果用户在其他小组中,先退出原小组
				await otherGroupMember.destroy()
				//* 加入新小组
				await GroupMember.create({ groupId, userId })
				success(res, `已退出${otherGroupMember.group.name},加入${group.name}成功`, null, 201)
			} else {
				//* 如果用户不在任何小组中,直接加入
				await GroupMember.create({ groupId, userId })
				//* 更新活动报名人数
				await event.update({
					registeredCount: event.registeredCount + 1,
				})
				success(res, '加入小组成功', null, 201)
			}
		}
	} catch (error) {
		failure(res, error)
	}
})
// #endregion

/**
 ** 公共方法：查询小组
 * @param req
 * @returns {Promise<{group: Group, members: GroupMember[]}>}
 */
// #region 查询小组
async function getGroup(req) {
	const { id } = req.params

	const group = await Group.findByPk(id, {
		attributes: { exclude: ['createdAt', 'updatedAt'] },
	})

	//* 检查小组是否存在
	if (!group) {
		throw new NotFound(`ID为${id}的小组未找到`)
	}

	const members = await group.getMembers({
		joinTableAttributes: [],
		attributes: ['id', 'nickname', 'avatar'],
	})

	return { group, members }
}
// #endregion

/**
 ** 公共方法：白名单过滤
 * @param req
 * @returns {{
 *   name: string,
 *   description: string,
 *   capacity: number,
 *   status: string,
 *   eventId: number
 * }}
 */
function filterBody(req) {
	return {
		name: req.body.name,
		description: req.body.description,
		capacity: req.body.capacity,
		status: req.body.status,
		eventId: req.body.eventId,
	}
}

export default router
