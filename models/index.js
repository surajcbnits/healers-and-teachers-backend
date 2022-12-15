const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.member = require("./member.js")(sequelize, Sequelize);
db.memberServices = require("./memberServices.js")(sequelize, Sequelize);
db.memberEvents = require("./memberEvents.js")(sequelize, Sequelize);
db.wellnessKeywords = require("./wellnessKeywords.js")(sequelize, Sequelize);
db.wellnessMapping = require("./wellnessMapping.js")(sequelize, Sequelize);
db.category = require("./category")(sequelize, Sequelize);


// Relationships 

// events to members
db.memberEvents.belongsTo(db.member);
db.member.hasMany(db.memberEvents);

// services to members
db.memberServices.belongsTo(db.member);
db.member.hasMany(db.memberServices);

// wellnessKeywords to wellnessMapping
db.wellnessMapping.belongsTo(db.wellnessKeywords);
db.wellnessKeywords.hasMany(db.wellnessMapping);

// wellnessKeywords to category
db.wellnessKeywords.belongsTo(db.category);
db.category.hasMany(db.wellnessKeywords);




module.exports = db;
