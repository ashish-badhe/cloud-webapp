import { connectDB } from "../databaseConfig/dbConnect.js";
import logger from "../logger.js";

export const connectDBMiddleware = async (req, res, next) => {
  try {
    await connectDB();

    next();
  } catch (err) {
    logger.error({
      message: "Error in connectDBMiddleware",
      error: err.message,
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 503,
    })
    console.log("Error in connectDBMiddleware ", err.message);
    res.status(503).json();
  }
};
