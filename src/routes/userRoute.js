import express from "express";
import {
  createUserController,
  updateUserController,
  getUserController,
  verifyUserController,
  deleteUserController,
} from "../controllers/userController.js";
import {
  authMiddleware,
  checkGetPayload,
  checkPostPayload,
  checkPutPayload,
  checkPublicHeaders,
} from "../middlewares/userMiddlerware.js";
import { connectDBMiddleware } from "../middlewares/dbMiddleware.js";

const route = express.Router();

route.post("/", checkPublicHeaders, checkPostPayload, connectDBMiddleware, createUserController);

route.all("/", (req, res) => {
  res.status(405).json();
});

route.put("/self", checkPutPayload, connectDBMiddleware, authMiddleware, updateUserController);
route.get("/self", checkGetPayload, connectDBMiddleware, authMiddleware, getUserController);

route.get("/self/:token", checkGetPayload,connectDBMiddleware, verifyUserController);

route.delete("/self/:id", deleteUserController);

route.all("/self", (req, res) => {
  res.status(405).json();
});

export default route;
