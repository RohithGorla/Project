'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Load all model files in this folder
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Call model-specific associate methods if they exist (optional)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

/**
 * -------------------------------------------------
 * Define associations between models
 * -------------------------------------------------
 *
 * This assumes you have these models:
 *  - Organisation
 *  - User
 *  - Employee
 *  - Team
 *  - EmployeeTeam
 *  - Log
 *
 * And that you generated them with `sequelize-cli model:generate`
 */
const { Organisation, User, Employee, Team, EmployeeTeam, Log } = db;

// Organisation has many Users, Employees, Teams, Logs
if (Organisation) {
  if (User) {
    Organisation.hasMany(User, { foreignKey: 'organisationId' });
    User.belongsTo(Organisation, { foreignKey: 'organisationId' });
  }

  if (Employee) {
    Organisation.hasMany(Employee, { foreignKey: 'organisationId' });
    Employee.belongsTo(Organisation, { foreignKey: 'organisationId' });
  }

  if (Team) {
    Organisation.hasMany(Team, { foreignKey: 'organisationId' });
    Team.belongsTo(Organisation, { foreignKey: 'organisationId' });
  }

  if (Log) {
    Organisation.hasMany(Log, { foreignKey: 'organisationId' });
    Log.belongsTo(Organisation, { foreignKey: 'organisationId' });
  }
}

// User → Logs
if (User && Log) {
  User.hasMany(Log, { foreignKey: 'userId' });
  Log.belongsTo(User, { foreignKey: 'userId' });
}

// Many-to-many Employee ↔ Team through EmployeeTeam
if (Employee && Team && EmployeeTeam) {
  Employee.belongsToMany(Team, {
    through: EmployeeTeam,
    foreignKey: 'employeeId',
  });

  Team.belongsToMany(Employee, {
    through: EmployeeTeam,
    foreignKey: 'teamId',
  });

  // Optional direct relations on the join table
  EmployeeTeam.belongsTo(Employee, { foreignKey: 'employeeId' });
  EmployeeTeam.belongsTo(Team, { foreignKey: 'teamId' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
