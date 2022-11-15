"use strict";
const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  class wellnessMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  wellnessMapping.init(
    {
      genarelid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      wellnesskeywordsid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("member", "event", "service" ),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "wellnessMapping",
    }
  );
  return wellnessMapping;
};
