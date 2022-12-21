"use strict";
const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Member.init(
    {
      firstName: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: DataTypes.STRING,
      country: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: "USA"
      },
      phoneno: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      aboutme: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      qualification: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      ip: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      accountstatus: {
        type: DataTypes.ENUM("active", "inactive" ),
        allowNull: false,
        defaultValue: "active"
      },
      virtualsessions: {
        type: DataTypes.ENUM("y", "n"),
        allowNull: false,
      },
      instagram: {
        type:  DataTypes.STRING(100),
        allowNull: true,
      },
      facebook: {
        type:  DataTypes.STRING(100),
        allowNull: true,
      },
      twitter: {
        type:  DataTypes.STRING(100),
        allowNull: true,
      },
      physicaladdress: {
        type:  DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Member",
    }
  );
  return Member;
};
