import Sound from "./sound";
import Hashtag from "./hashtag";
import Comment from "./comment";
import { extractVideoIdFromUrl } from "../helpers";
import { InvalidResponseException } from "../errors";
import { DateTime } from "luxon"; // You may need to use a date library like Luxon for datetime manipulation
import TikTokApi, { Proxy } from "..";
import User from "./user";
import axios from "axios";

class Video {
  static parent: TikTokApi;
  id?: string;
  url?: string;
  create_time?: DateTime;
  stats?: Record<string, any>;
  author?: User;
  sound?: Sound;
  hashtags?: Hashtag[];
  as_dict?: Record<string, any>;

  constructor({
    id,
    url,
    data,
    ...kwargs
  }: {
    id?: string;
    url?: string;
    data?: Record<string, any>;
    proxy?: Proxy;
    session_index?: number;
  }) {
    this.id = id;
    this.url = url;

    if (data) {
      this.as_dict = data;
      this.__extract_from_data();
    } else if (url) {
      const [i, session] = Video.parent.get_session({ ...kwargs });
      extractVideoIdFromUrl(url, {
        headers: session.headers,
        proxy: kwargs.proxy || session.proxy,
      })
        .then((id) => {
          this.id = id;
        })
        .catch((error) => {
          throw error;
        });
    }

    if (!this.id) {
      throw new TypeError("You must provide id or url parameter.");
    }
  }

  async info(kwargs: {
    proxy?: Proxy;
    session_index?: number;
  }): Promise<Record<string, any>> {
    const [i, session] = Video.parent.get_session({ ...kwargs });
    const proxy = kwargs?.proxy || session.proxy;

    if (!this.url) {
      throw new TypeError(
        "To call video.info() you need to set the video's url."
      );
    }

    try {
      const r = await axios.get(this.url, {
        headers: session.headers,
        proxy: proxy,
      });

      // Extract JSON data from the response text
      const start = r.data.indexOf(
        '<script id="SIGI_STATE" type="application/json">'
      );
      if (start === -1) {
        throw new InvalidResponseException(
          r.data,
          "TikTok returned an invalid response.",
          r.status
        );
      }

      const end = r.data.indexOf("</script>", start);
      if (end === -1) {
        throw new InvalidResponseException(
          r.data,
          "TikTok returned an invalid response.",
          r.status
        );
      }

      const data = JSON.parse(r.data.slice(start, end));
      const video_info = data["ItemModule"][this.id ?? ""];
      this.as_dict = video_info;
      this.__extract_from_data();
      return video_info;
    } catch (e: any) {
      throw new InvalidResponseException(
        e,
        "TikTok returned an invalid response.",
        e.response.data
      );
    }
  }

  async bytes(...kwargs: any[]): Promise<Uint8Array> {
    throw new Error("Method 'bytes' not implemented yet.");
  }

  private __extract_from_data(): void {
    const data = this.as_dict ?? {};

    this.id = data["id"];

    const timestamp = data["createTime"];
    if (timestamp !== undefined) {
      this.create_time = DateTime.fromMillis(timestamp * 1000);
    }

    this.stats = data["stats"];

    const author = data["author"];
    if (typeof author === "string") {
      this.author = new Video.parent.user({ username: author });
    } else {
      this.author = new Video.parent.user({ data: author });
    }

    this.sound = new Video.parent.sound({ data: data });

    this.hashtags = (data["challenges"] || []).map(
      (hashtagData: Record<string, any>) => {
        return new Video.parent.hashtag({ data: hashtagData });
      }
    );

    if (this.id === undefined) {
      Video.parent?.logger.error(
        `Failed to create Video with data: ${data}\nwhich has keys ${Object.keys(
          data
        )}`
      );
    }
  }

  async *comments(
    count: number = 20,
    cursor: number = 0,
    ...kwargs: any[]
  ): AsyncGenerator<Comment, void, unknown> {
    let found = 0;
    while (found < count) {
      const params = {
        aweme_id: this.id,
        count: 20,
        cursor: cursor,
      };

      const resp = await Video.parent?.make_request({
        url: "https://www.tiktok.com/api/comment/list/",
        params: params,
        headers: kwargs.find((arg) => arg.headers !== undefined)?.headers,
        session_index: kwargs.find((arg) => arg.session_index !== undefined)
          ?.session_index,
      });

      if (!resp) {
        throw new InvalidResponseException(
          resp,
          "TikTok returned an invalid response."
        );
      }

      for (const commentData of resp["comments"] || []) {
        yield new Video.parent.comment({ data: commentData });
        found += 1;
      }

      if (!resp["has_more"]) {
        return;
      }

      cursor = resp["cursor"];
    }
  }

  async *related_videos(
    count: number = 30,
    cursor: number = 0,
    ...kwargs: any[]
  ): AsyncGenerator<Video, void, unknown> {
    let found = 0;
    while (found < count) {
      const params = {
        itemID: this.id,
        count: 16,
      };

      const resp = await Video.parent?.make_request({
        url: "https://www.tiktok.com/api/related/item_list/",
        params: params,
        headers: kwargs.find((arg) => arg.headers !== undefined)?.headers,
        session_index: kwargs.find((arg) => arg.session_index !== undefined)
          ?.session_index,
      });

      if (!resp) {
        throw new InvalidResponseException(
          resp,
          "TikTok returned an invalid response."
        );
      }

      for (const videoData of resp["itemList"] || []) {
        yield new Video.parent.video({
          data: videoData,
        });
        found += 1;
      }
    }
  }

  toString(): string {
    return `TikTokApi.video(id='${this.id}')`;
  }
}

export default Video;
