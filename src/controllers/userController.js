import logger from "../logger.js";
import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";
import { pubsubService } from "../services/pubsubService.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

export const createUserController = async (req, res) => {
  try {
    const { first_name, last_name, username, password, account_created, account_updated, ...rest } = req.body;

    if (Object.keys(rest).length) {
      let error = new Error("Invalid Payload");
      error.statusCode = 400;
      throw error;
    }

    if (!first_name || !last_name || !username || !password) {
      let error = new Error("Mandatory Fields Missing");
      error.statusCode = 400;
      throw error;
    }

    if (account_created) {
      logger.warn({
        message: "Account Created field can not be changed",
        requestMethod: req.method,
        requestUrl: req.baseUrl,
      });
    }
    if (account_updated) {
      logger.warn({
        message: "Account Updated field can not be changed",
        requestMethod: req.method,
        requestUrl: req.baseUrl,
      });
    }

    let regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isEmailValid = regExp.test(username);
    if (!isEmailValid) {
      let error = new Error("Invalid Email");
      error.statusCode = 400;
      throw error;
    }

    // hashpassword
    const hashedPassword = await bcryptjs.hash(password, 8);

    // Check if email is already used
    let isUserExist = await User.findOne({
      where: {
        username,
      },
    });

    if (isUserExist) {
      let error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    const token = uuidv4();

    // Create new user
    let user = await User.create({ first_name, last_name, username, password: hashedPassword, token });

    user = user.get();
    delete user.password;
    delete user.token;

    // pubsub data to be sent to Cloud Function
    const pubsubData = {
      userId: user.id,
      name: user.first_name,
      username: user.username,
      dbName: process.env.DATABASE_NAME,
      dbUser: process.env.DATABASE_USER,
      dbPassword: process.env.DATABASE_PASSWORD,
      port: process.env.PORT,
      host: process.env.HOST,
      verificationLink: `https://${process.env.DOMAIN}/v2/user/self/${token}`
    };

    const dataBuffer = Buffer.from(JSON.stringify(pubsubData));

    // Call Pubsub
    if (process.env.ENVIRONMENT !== "dev") {
      pubsubService(dataBuffer, process.env.PUBSUB_TOPIC, process.env.PUBSUB_SUBSCRIPTION);
    }

    logger.info({
      message: `User ${user.id} created successfully`,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 201,
    });
    res.status(201).json(user);
  } catch (err) {
    logger.error({
      message: "Error in createUserController",
      error: err.message,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: err.statusCode,
    });
    console.log("Error in createUserController", err.message);
    res.status(err.statusCode || 500).json();
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { first_name, last_name, password, ...invalidFields } = req.body;

    if (Object.keys(invalidFields).length) {
      let error = new Error("Invalid payload fields");
      error.statusCode = 400;
      throw error;
    }

    let updatedData = {};

    if (password) {
      updatedData.password = await bcryptjs.hash(password, 8);
    }

    if (first_name) {
      updatedData.first_name = first_name;
    }

    if (last_name) {
      updatedData.last_name = last_name;
    }

    const user = await req.user.update(updatedData);

    logger.info({
      message: `User ${user.id} updated successfully`,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 204,
    });
    res.status(204).json();
  } catch (err) {
    logger.error({
      message: "Error in updateUserController",
      error: err.message,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: err.statusCode,
    });
    console.log("Error in updateUserController", err.message);
    res.status(err.statusCode || 500).json();
  }
};

export const getUserController = async (req, res) => {
  try {
    let user = req.user.get();
    delete user.password;

    logger.info({
      message: `User ${user.id} retrieved successfully`,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 200,
    });
    res.status(200).json(user);
  } catch (err) {
    logger.error({
      message: "Error in getUserController",
      error: err.message,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: err.statusCode,
    });
    console.log("Error in getUserController", err.message);
    res.status(500).json();
  }
};

export const verifyUserController = async (req, res) => {
  try {
    const token = req.params.token;

    if (!token) {
      let error = new Error("Token not found");
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findOne({ where: { token } });
    if (!user) {
      let error = new Error("User is unauthenticated");
      error.statusCode = 403;
      throw error;
    }

    let tokenExpTime = new Date(user.emailSentTime).getTime() + (2 * 60 * 1000);
    let currentTime = new Date().getTime();
    if (currentTime > tokenExpTime) {
      let error = new Error("Token expired");
      error.statusCode = 403;
      throw error;
    }

    user.verified = true;
    await user.save();

    logger.info({
      message: `User ${user.id} verified successfully`,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 200,
    });
    res.status(200).json({
      message: "User verified successfully",
    });
  } catch (err) {
    logger.error({
      message: "Error in verifyUserController",
      error: err.message,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: err.statusCode,
    });
    console.log("Error in verifyUserController", err.message);
    res.status(err.statusCode || 403).json({ message: err.message });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
