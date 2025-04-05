import nodemon from 'nodemon'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//* 清除控制台
console.clear()

const port = process.env.PORT || '3000'

const messages = {
	crash: '🚨 应用崩溃，等待文件变化后重启...',
	restart: '🔄 检测到文件变化，正在重启...',
	start: '🚀 应用启动中...',
	ready: `✅ 服务已启动，监听端口: ${port}`,
	quit: '👋 服务已停止',
	error: '❌ 发生错误:',
}

let isFirstStart = true

//* 配置nodemon
nodemon({
	script: join(__dirname, '../bin/www'),
	ext: 'js,json,env',
	ignore: ['node_modules/*', 'logs/*'],
	env: { NODE_ENV: process.env.NODE_ENV },
	watch: [join(__dirname, '..')],
	// delay: '1000',
})

//* 监听重启事件
nodemon.on('restart', function (files) {
	// console.log('\n' + messages.restart + '\n')
	console.log('\n' + messages.restart)
	if (files) {
		console.log('')
		console.log('变更的文件:')
		files.forEach((file) => {
			// 提取Backend之后的路径
			const backendIndex = file.indexOf('Backend')
			const shortPath = backendIndex !== -1 ? file.substring(backendIndex + 7) : file
			console.log(`  - ${shortPath}`)
		})
	}
})

//* 监听启动事件
nodemon.on('start', function () {
	if (isFirstStart) {
		console.log('\n' + messages.start)
		isFirstStart = false
	}
	console.log('\n' + messages.ready)
})

//* 监听退出事件
nodemon.on('quit', function () {
	process.exit()
})

//* 监听错误事件
nodemon.on('error', function (err) {
	console.error('\n' + messages.error, err, '\n')
})

//* 处理进程退出信号
process.on('SIGINT', () => {
	console.log('\n' + messages.quit + '\n')
	process.exit(0)
})
