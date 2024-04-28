import express from "express";
import { healthzController } from "../controllers/healthzController.js";
import { checkGetPayload, checkPublicHeaders } from "../middlewares/userMiddlerware.js";

const route = express.Router();

route.get("/", checkPublicHeaders, checkGetPayload, healthzController);

route.all("/", (req, res) => {
  res.status(405).json();
});

export default route;
