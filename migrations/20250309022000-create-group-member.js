/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('group_members', {
			id: {
				type: Sequelize.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '成员ID',
			},
			groupId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: 'Groups',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
				comment: '群组ID',
			},
			userId: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
				comment: '用户ID',
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				comment: '创建时间',
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				comment: '更新时间',
			},
		})

		// 添加索引
		await queryInterface.addIndex('group_members', ['groupId'], {
			name: 'group_members_group_index',
		})
		await queryInterface.addIndex('group_members', ['userId'], {
			name: 'group_members_user_index',
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('group_members')
	},
}
