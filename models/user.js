'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 定义关联关系
      User.hasMany(models.Event, {
        foreignKey: 'creatorId',
        as: 'createdEvents'
      });
      User.hasMany(models.Rating, {
        foreignKey: 'userId',
        as: 'givenRatings'
      });
      User.hasMany(models.Rating, {
        foreignKey: 'ratedUserId',
        as: 'receivedRatings'
      });
      User.hasMany(models.Point, {
        foreignKey: 'userId',
        as: 'points'
      });
      User.hasMany(models.Reservation, {
        foreignKey: 'userId',
        as: 'reservations'
      });
      User.belongsToMany(models.Group, {
        through: 'GroupMembers',
        foreignKey: 'userId',
        as: 'groups'
      });
      User.belongsToMany(models.Event, {
        through: 'EventParticipants',
        foreignKey: 'userId',
        as: 'participatedEvents'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '用户ID，主键'
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: '用户名必须存在。'
        },
        notEmpty: {
          msg: '用户名不能为空。'
        },
        len: {
          args: [2, 20],
          msg: '用户名长度需要在2 ~ 20个字符之间。'
        }
      },
      comment: '用户名，唯一且非空'
    },
    nickname: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 20],
          msg: '昵称长度不能超过20个字符。'
        }
      },
      comment: '昵称'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '密码必须存在。'
        },
        notEmpty: {
          msg: '密码不能为空。'
        }
      },
      comment: '密码，非空'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: '邮箱必须存在。'
        },
        isEmail: {
          msg: '请输入有效的邮箱地址。'
        }
      },
      comment: '邮箱，唯一且非空'
    },
    gender: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 2,
      validate: {
        isIn: {
          args: [[0, 1, 2]],
          msg: '性别只能是0（女）、1（男）或2（保密）。'
        }
      },
      comment: '性别，非空且无符号，默认值为2'
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: '头像必须是有效的URL地址。'
        }
      },
      comment: '头像'
    },
    introduce: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [0, 500],
          msg: '个人介绍不能超过500个字符。'
        }
      },
      comment: '个人介绍'
    },
    role: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: {
          args: [[0, 1]],
          msg: '角色只能是0（普通用户）或1（管理员）。'
        }
      },
      comment: '角色，非空、无符号，默认值为0'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
