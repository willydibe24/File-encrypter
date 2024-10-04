import express from "express";
import { decrypt } from "../controllers/decrypt";


const router = express.Router();

router.post("/decrypt", decrypt);

export default router;