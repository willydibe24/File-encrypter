import express from "express";
import { encrypt } from "../controllers/encrypt";


const router = express.Router();

router.post("/encrypt", encrypt);

export default router;