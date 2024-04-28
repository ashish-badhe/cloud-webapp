import app from "./app.js";
import logger from "./logger.js";

// Listen server on PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
  logger.debug({
    message: `Server running successfully on PORT ${PORT}`
  });
  console.log(`Server running successfully on PORT ${PORT}`);
});
