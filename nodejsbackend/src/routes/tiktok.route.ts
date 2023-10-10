import { Router } from "express";
import { getTrendingVideos } from "../controllers/tiktok.controller";

const router = Router();

router.get("/trending", getTrendingVideos);

export default router;