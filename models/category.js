"use strict";
const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      image: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(5000),
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
