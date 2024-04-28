import { createLogger, format, transports } from "winston";
import dotenv from "dotenv";

dotenv.config();

let filePath = process.env.ENVIRONMENT === "dev" ? "log/webapp.log" : "/var/log/webapp/webapp.log";

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  level: "debug",
  transports: [
    new transports.Console(),
    new transports.File({
      filename: filePath,
    }),
  ],
});

export default logger;
