/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Groups', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
				comment: '小组ID,主键',
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '我是个小组',
				comment: '小组名称,非空',
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
				defaultValue: '我是个小组描述',
				comment: '小组描述',
			},
			capacity: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 6,
				comment: '小组容量,非空,默认6人',
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '公开',
				comment: '小组状态：公开、私密、关闭',
			},
			eventId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '活动ID,外键,关联events表',
				references: {
					model: 'Events',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				comment: '创建时间',
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				comment: '更新时间',
			},
		})

		// 添加索引
		await queryInterface.addIndex('Groups', ['eventId'])
		await queryInterface.addIndex('Groups', ['status'])
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Groups')
	},
}
