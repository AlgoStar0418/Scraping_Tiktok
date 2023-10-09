import TikTokApi from "..";
import { InvalidResponseException } from "../errors";

class Hashtag {
  static parent: TikTokApi;
  id?: string;
  name?: string;
  as_dict?: Record<string, any>;
  split_name: any;
  stats: any;

  constructor({
    name,
    id,
    data,
  }: {
    name?: string;
    id?: string;
    data?: Record<string, any>;
  }) {
    if (name) {
      this.name = name;
    }
    if (id) {
      this.id = id;
    }
    if (data) {
      this.as_dict = data;
      this.__extract_from_data();
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
  }): Promise<Record<string, any>> {
    if (!this.name) {
      throw new Error(
        "You must provide the name when creating this class to use this method."
      );
    }

    const url_params = {
      challengeName: this.name,
      msToken: ms_token,
    };

    const resp = await Hashtag.parent.make_request({
      url: "https://www.tiktok.com/api/challenge/detail/",
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
    ...kwargs
  }: {
    count: number;
    cursor: number;
    ms_token?: string;
    headers?: Record<string, any>;
    session_index?: number;
  }) {
    let id = this.id;
    if (!id) {
      await this.info({ ...kwargs });
    }
    let found = 0;
    const videos = [];
    while (found < count) {
      const params = {
        challengeID: this.id,
        count: 30,
        cursor: cursor,
      };

      const resp = await Hashtag.parent.make_request({
        url: "https://www.tiktok.com/api/challenge/item_list/",
        params: params,
        headers: kwargs.headers,
        session_index: kwargs.session_index,
      });

      if (!resp) {
        throw new InvalidResponseException(
          resp,
          "TikTok returned an invalid response."
        );
      }

      for (const video of resp.itemList || []) {
        videos.push(new Hashtag.parent.video({ data: video }));
        found += 1;
      }

      if (!resp.hasMore) {
        return;
      }

      cursor = resp.cursor;
    }
  }
  private __extract_from_data() {
    const data = this.as_dict ?? {};
    const keys = Object.keys(data);

    if ("title" in keys) {
      this.id = data.id;
      this.name = data.title;
    }

    if ("challengeInfo" in keys) {
      if ("challenge" in data.challengeInfo) {
        this.id = data.challengeInfo.challenge.id;
        this.name = data.challengeInfo.challenge.title;
        this.split_name = data.challengeInfo.challenge.splitTitle;
      }

      if ("stats" in data.challengeInfo) {
        this.stats = data.challengeInfo.stats;
      }
    }

    const id = this.id;
    const name = this.name;
    if (id === undefined || name === undefined) {
      Hashtag.parent.logger.error(
        `Failed to create Hashtag with data: ${data}\nwhich has keys ${keys}`
      );
    }
  }

  toString() {
    return `TikTokApi.hashtag(id='${this.id}', name='${this.name}')`;
  }
}

export default Hashtag;
