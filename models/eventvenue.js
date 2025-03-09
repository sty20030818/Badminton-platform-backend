'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventVenue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 定义关联关系
      // 这是一个关联表，不需要定义额外的关联
    }
  }
  EventVenue.init({
    eventId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: '活动ID必须存在。'
        }
      },
      comment: '活动ID，外键，关联events表'
    },
    venueId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: '场地ID必须存在。'
        }
      },
      comment: '场地ID，外键，关联venues表'
    }
  }, {
    sequelize,
    modelName: 'EventVenue',
  });
  return EventVenue;
};
