import { Sequelize, DataTypes } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const { DATABASE_USERNAME } = process.env;
const { DATABASE_PASSWORD } = process.env;
const { DATABASE_HOST } = process.env;

// init connection to azure mysql db
export const sequelize = new Sequelize(
  "questions-db",
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  {
    host: DATABASE_HOST,
    dialect: "mysql",
  },
);

// check connection
sequelize.authenticate().then(() => {
  console.log("Connection has been established successfully.");
}).catch((error) => {
  console.error("Unable to connect to the database: ", error);
});

export const Question = sequelize.define("questions", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  example: {
    type: DataTypes.JSON,
  },
  constraint: {
    type: DataTypes.JSON,
  },
});
