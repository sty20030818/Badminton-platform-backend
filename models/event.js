'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //* 定义与 User 模型的关联关系
      // Event.belongsTo(models.User, {
      //   foreignKey: 'creatorId',
      //   as: 'creator'
      // });
    }
  }
  Event.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '活动ID,主键'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '活动名称,非空'
    },
    description: {
      type: DataTypes.TEXT,
      comment: '活动描述'
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '活动时间,非空'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '活动地点,非空'
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '创建者ID,外键,关联users表'
    },
    participants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '参与者数量,非空、无符号,默认值为0'
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '活动难度等级,非空、无符号'
    },
    eventType: {
      type: DataTypes.STRING,
      comment: '活动类型（例如：羽毛球,篮球等）'
    },
    registrationDeadline: {
      type: DataTypes.DATE,
      comment: '报名截止日期'
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
