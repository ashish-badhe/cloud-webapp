import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "../logger.js";

//dotenv config
dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.HOST,
  dialect: "mysql",
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.debug({
      message: `Connection has been established successfully.`
    });
    console.log("Connection has been established successfully.");
  } catch (error) {
    logger.error({
      message: "Unable to connect to the database",
      error: error.message
    })
    console.error("Unable to connect to the database:", error.message);
    throw new Error(error.message);
  }
};

