import express from "express";

import { signup, login, getUsers } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
router.get("/users", protectRoute, getUsers);


export default router;
