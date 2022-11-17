"use strict";
const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  class MemberServices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MemberServices.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      feetype: {
        type: DataTypes.ENUM("fixed", "sliding scale", "free" ),
        allowNull: false,
      },
      slidingscalemin: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      slidingscalemax: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      feepersession: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MemberServices",
    }
  );
  return MemberServices;
};
