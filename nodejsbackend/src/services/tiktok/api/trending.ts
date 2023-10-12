import TikTokApi from "..";
import { InvalidResponseException } from "../errors";
import Video from "./video";

export class Trending {
  static parent: TikTokApi;

  static async videos({
    count = 10,
    ...kwargs
  }: {
    count: number;
    headers?: Record<string, any>;
    session_index?: number;
  }): Promise<Video[]> {
    let found = 0;
    const videos: Video[] = [];

    while (found < count) {
      const batchSize = Math.min(count - found, 30); // Calculate the batch size, maximum 30 at a time
      const params = {
        from_page: "fyp",
        count: batchSize, // Use the batch size for this request
        ...kwargs,
      };

      const resp = await Trending.parent.make_request({
        url: "https://www.tiktok.com/api/recommend/item_list/",
        params,
        headers: kwargs.headers,
        session_index: kwargs.session_index,
      });

      if (resp === null) {
        throw new InvalidResponseException(
          resp,
          "TikTok returned an invalid response."
        );
      }

      for (const videoData of resp.itemList || []) {
        let video = new Trending.parent.video({ data: videoData });
        if (videoData.video.duration <= 120 && videoData.video.duration >= 30) {
          videos.push(videoData);
          found++;
        }
      }

      if (!resp.hasMore || found >= count) {
        break;
      }
    }

    return videos;
  }
}
