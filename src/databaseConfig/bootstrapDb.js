import mysql from "mysql2/promise";
import { connectDB, sequelize } from "./dbConnect.js";
import dotenv from "dotenv";
import logger from "../logger.js";

//dotenv config
dotenv.config();

export const bootstrapDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`);
    await createTable();
  } catch (err) {
    logger.error({
      message: "Error while bootstraping DB",
      error: err.message
    })
    console.log("Error while bootstraping DB", err.message);
    throw new Error(err);
  }
};

const createTable = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    logger.debug({
      message: `Synced Models successfully`
    });
    console.log("Synced Models successfully");
  } catch (err) {
    logger.error({
      message: "Failed to sync models",
      error: err.message
    })
    console.log("Failed to sync models");
  }
};
