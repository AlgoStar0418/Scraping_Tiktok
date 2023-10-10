import tiktokRouter from "./tiktok.route";
import { Router } from "express";

const router = Router();

router.use("/tiktok", tiktokRouter);

export default router;