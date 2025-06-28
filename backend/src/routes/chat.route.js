import express from "express";
import { protectroute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";


const router = express.Router();
router.get("/token",protectroute,getStreamToken)

export default router;