/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Venues', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
				comment: '场馆ID,主键',
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '场馆名称,非空',
			},
			location: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '场馆位置,非空',
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
				defaultValue: '我是一个场馆',
				comment: '场馆描述',
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '可用',
				comment: '场馆状态,非空',
			},
			cover: {
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: 'venueDefault',
				comment: '场馆封面图片URL',
			},
			latitude: {
				type: Sequelize.DECIMAL(10, 6),
				allowNull: true,
				defaultValue: 0,
				comment: '场馆纬度',
			},
			longitude: {
				type: Sequelize.DECIMAL(10, 6),
				allowNull: true,
				defaultValue: 0,
				comment: '场馆经度',
			},
			openTime: {
				type: Sequelize.TIME,
				allowNull: false,
				defaultValue: '08:00:00',
				comment: '场馆开放时间,格式HH:mm:ss',
			},
			closeTime: {
				type: Sequelize.TIME,
				allowNull: false,
				defaultValue: '22:00:00',
				comment: '场馆关闭时间,格式HH:mm:ss',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})

		// 添加索引
		await queryInterface.addIndex('Venues', ['name'])
		await queryInterface.addIndex('Venues', ['status'])
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Venues')
	},
}
