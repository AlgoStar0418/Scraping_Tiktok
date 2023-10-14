import { Request, Response } from "express";
import { api } from "..";

export const getTrendingVideos = async (req: Request, res: Response) => {
  try {
    let { limit } = req.query;
    if (typeof limit !== "string") {
      return res.status(400).json({ error: "Invalid limit" });
    }
    let limitNumber = parseInt(limit);
    if (limitNumber < 1) {
      return res.status(400).json({ error: "Invalid limit" });
    }
    const trending = await api.trending.videos({ count: limitNumber });
    return res.status(200).json({ trending, total: trending.length });
  } catch (error) {
    return res.status(500).json(error);
  }
};
