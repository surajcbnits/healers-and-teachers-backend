module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
    });
  
    return Users;
  };
  