module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
  },
  {
    // Options
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return Users;
};
