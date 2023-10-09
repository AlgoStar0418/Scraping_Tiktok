import TikTokApi from "..";
import { InvalidResponseException } from "../errors";
import User from "./user";
import Video from "./video";

class Sound {
  static parent: TikTokApi;
  id?: string;
  title?: string;
  author?: User;
  duration?: number;
  original?: boolean;

  private as_dict: any;
  play_url: any;
  cover_large: any;
  stats: any;

  constructor({ id, data }: { id?: string; data?: Record<string, any> }) {
    this.id = id;
    if (data) {
      this.as_dict = data;
      this.__extract_from_data();
    } else if (!id) {
      throw TypeError("You must provide id paremeter.");
    } else {
      this.id = id;
    }
  }

  async info({
    ms_token,
    headers,
    session_index,
  }: {
    ms_token?: string;
    headers?: Record<string, any>;
    session_index?: number;
  }): Promise<any> {
    const id = this.id;
    if (!id) {
      throw new Error(
        "You must provide an id when creating this class to use this method."
      );
    }

    const url_params = {
      msToken: ms_token,
      musicId: id,
    };

    const resp = await Sound.parent.make_request({
      url: "https://www.tiktok.com/api/music/detail/",
      params: url_params,
      headers: headers,
      session_index: session_index,
    });

    if (!resp) {
      throw new InvalidResponseException(
        resp,
        "TikTok returned an invalid response."
      );
    }

    this.as_dict = resp;
    this.__extract_from_data();
    return resp;
  }

  async *videos({
    count = 30,
    cursor = 0,
    headers,
    session_index,
  }: {
    count: number;
    cursor: number;
    headers: Record<string, any>;
    session_index?: number;
  }): AsyncGenerator<Video> {
    const id = this.id;
    if (!id) {
      throw new Error(
        "You must provide an id when creating this class to use this method."
      );
    }

    let found = 0;
    const videos = [];
    while (found < count) {
      const params = {
        musicID: id,
        count: 30,
        cursor: cursor,
      };

      const resp = await Sound.parent.make_request({
        url: "https://www.tiktok.com/api/music/item_list/",
        params: params,
        headers: headers,
        session_index: session_index,
      });

      if (!resp) {
        throw new InvalidResponseException(
          resp,
          "TikTok returned an invalid response."
        );
      }

      for (const video of resp.itemList || []) {
        videos.push(new Sound.parent.video({ data: video }));
        found += 1;
      }

      if (!resp.hasMore) {
        return;
      }

      cursor = resp.cursor;
    }
  }

  private __extract_from_data() {
    const data = this.as_dict;
    const keys = Object.keys(data);

    if ("musicInfo" in keys) {
      const author = data.musicInfo.author;
      if (typeof author === "object") {
        this.author = new Sound.parent.user({ data: author });
      } else if (typeof author === "string") {
        this.author = new Sound.parent.user({ username: author });
      }

      if (data.musicInfo.music) {
        this.title = data.musicInfo.music.title;
        this.id = data.musicInfo.music.id;
        this.original = data.musicInfo.music.original;
        this.play_url = data.musicInfo.music.playUrl;
        this.cover_large = data.musicInfo.music.coverLarge;
        this.duration = data.musicInfo.music.duration;
      }
    }

    if ("music" in keys) {
      this.title = data.music.title;
      this.id = data.music.id;
      this.original = data.music.original;
      this.play_url = data.music.playUrl;
      this.cover_large = data.music.coverLarge;
      this.duration = data.music.duration;
    }

    if ("stats" in keys) {
      this.stats = data.stats;
    }

    if (!this.id) {
      Sound.parent.logger.error(`Failed to create Sound with data: ${data}\n`);
    }
  }
  toString() {
    return `TikTokApi.sound(id='${this.id}')`;
  }
}

export default Sound;
