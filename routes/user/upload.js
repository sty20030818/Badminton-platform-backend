import express from 'express'
import { config, client, singleFileUpload } from '../../utils/aliyun.js'
import pkg from 'http-errors'
const { BadRequest } = pkg
import { success, failure } from '../../utils/responses.js'

const router = express.Router()

/**
 ** 阿里云 OSS 客户端上传
 ** POST /uploads/aliyun
 */
router.post('/aliyun', function (req, res) {
	try {
		singleFileUpload(req, res, function (error) {
			if (error) {
				return failure(res, error)
			}

			if (!req.file) {
				return failure(res, new BadRequest('请选择要上传的文件。'))
			}

			success(res, '上传成功。', { file: req.file })
		})
	} catch (error) {
		failure(res, error)
	}
})

export default router
