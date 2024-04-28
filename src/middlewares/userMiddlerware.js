import logger from "../logger.js";
import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

//dotenv config
dotenv.config();


export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      throw new Error("Token not found");
    }

    token = token.replace("Basic ", "");
    const tokenString = Buffer.from(token, "base64").toString("utf-8").split(":");

    let username = tokenString[0];
    let password = tokenString[1];

    let user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    let userVerified = user.verified;
    if(!userVerified && process.env.ENVIRONMENT !== "dev"){
      let error = new Error("User not verified: Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Password not matching"); 
    }

    req.user = user;

    next();
  } catch (err) {
    logger.error({
      message: "Error in auth Middleware",
      error: err.message,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 401,
    })
    console.log("Error in auth Middleware", err.message);
    res.status(err.statusCode || 401).json();
  }
};

export const checkPostPayload = (req, res, next) => {
  try {
    const isQueryParam = Object.keys(req.query).length ? true : false;
    if (isQueryParam) {
      throw new Error("Invalid Payload with query parameters for POST");
    }

    const payloadFields = Object.keys(req.body);
    if (!payloadFields.length) {
      throw new Error("Empty payload for POST");
    }

    next();
  } catch (err) {
    logger.error({
      message: "Error in checkPostPayload middleware",
      error: err.message,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 400,
    })
    console.log("Error in checkPostPayload middleware", err.message);
    res.status(400).json();
  }
};

export const checkPutPayload = (req, res, next) => {
  try {
    const isQueryParam = Object.keys(req.query).length ? true : false;
    if (isQueryParam) {
      throw new Error("Invalid Payload with query parameters for POST");
    }

    const payloadFields = Object.keys(req.body);
    if (!payloadFields.length) {
      throw new Error("Empty payload");
    }

    next();
  } catch (err) {
    logger.error({
      message: "Error in checkPutPayload Middleware",
      error: err.message,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 400,
    })
    console.log("Error in checkPutPayload Middleware", err.message);
    res.status(400).json();
  }
};

export const checkGetPayload = (req, res, next) => {
  try {
    // If HEAD request enter GET route
    if (req.method !== "GET") {
      res.status(405).json();
      return;
    }

    // Check for req payload or query paramters
    let isPayload = Object.keys(req.body).length ? true : false;
    let isQueryParam = Object.keys(req.query).length ? true : false;
    let payloadContentLength = req.headers["content-length"];

    // Send bad request if any payload is present
    if (isPayload || isQueryParam || payloadContentLength) {
      throw new Error("Payload provided for GET Request");
    }

    next();
  } catch (err) {
    logger.error({
      message: "Error in checkGetPayload middleware",
      error: err.message,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 400,
    })
    console.log("Error in checkGetPayload middleware", err.message);
    res.status(400).json();
  }
};

export const checkPublicHeaders = (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (token) {
      throw new Error("Sent auth token for public api");
    }

    next();
  } catch (err) {
    logger.error({
      message: "Error in checkPublicHeader",
      error: err.message,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 400,
    })
    console.log("Error in checkPublicHeader", err.message);
    res.status(400).json();
  }
};
