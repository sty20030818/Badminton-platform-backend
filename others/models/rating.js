'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Rating extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// 定义关联关系
			Rating.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'rater',
			})
			Rating.belongsTo(models.User, {
				foreignKey: 'ratedUserId',
				as: 'rated',
			})
		}
	}
	Rating.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
				comment: '评分ID，主键',
			},
			userId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '评分用户ID必须存在',
					},
				},
				comment: '评分用户ID，外键，关联users表',
			},
			ratedUserId: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '被评分用户ID必须存在',
					},
					notEqual(value) {
						if (value === this.userId) {
							throw new Error('不能给自己评分')
						}
					},
				},
				comment: '被评分用户ID，外键，关联users表',
			},
			rating: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				validate: {
					notNull: {
						msg: '评分必须存在',
					},
					min: {
						args: [1],
						msg: '评分不能小于1',
					},
					max: {
						args: [5],
						msg: '评分不能大于5',
					},
				},
				comment: '评分，非空、无符号',
			},
		},
		{
			sequelize,
			modelName: 'Rating',
		},
	)
	return Rating
}
