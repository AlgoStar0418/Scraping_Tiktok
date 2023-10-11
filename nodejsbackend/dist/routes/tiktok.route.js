"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiktok_controller_1 = require("../controllers/tiktok.controller");
const router = (0, express_1.Router)();
router.get("/trending", tiktok_controller_1.getTrendingVideos);
exports.default = router;
