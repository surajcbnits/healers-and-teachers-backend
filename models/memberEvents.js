"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MemberEvents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  MemberEvents.init(
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      startdatetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      enddatetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("in person", "virtual"),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      feetype: {
        type: DataTypes.ENUM("fixed", "sliding scale", "free"),
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
      recurring: {
        type: DataTypes.ENUM("y", "n"),
        allowNull: false,
      },
      recurringschedule: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MemberEvents",
    }
  );
  return MemberEvents;
};
