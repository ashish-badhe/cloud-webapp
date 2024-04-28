import { connectDB } from "../databaseConfig/dbConnect.js";
import logger from "../logger.js";

export const healthzController = async (req, res) => {
  try {
    await connectDB();

    logger.info({
      message: "Database connection is active",
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 200
    })
    res.status(200).json();
  } catch (error) {
    logger.error({
      message: "Database connection is inactive",
      requestMethod: req.method,
      requestUrl: req.baseUrl,
      status: 503
    })
    res.status(503).json();
  }
};
