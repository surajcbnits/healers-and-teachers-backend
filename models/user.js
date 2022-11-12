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
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    password: DataTypes.STRING,
    country: DataTypes.STRING,
    phoneno: DataTypes.STRING,
    website: DataTypes.STRING,
    aboutme: DataTypes.STRING,
    descriptionofservices: DataTypes.STRING,
    wellnesskeywords: DataTypes.STRING,
    qualification: DataTypes.STRING,
    ip: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};