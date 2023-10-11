"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendingVideos = void 0;
const __1 = require("..");
const getTrendingVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit } = req.query;
        if (typeof limit !== "string") {
            return res.status(400).json({ error: "Invalid limit" });
        }
        let limitNumber = parseInt(limit);
        const trending = yield __1.api.trending.videos({ count: limitNumber });
        return res.status(200).json({ trending, total: limit });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getTrendingVideos = getTrendingVideos;
