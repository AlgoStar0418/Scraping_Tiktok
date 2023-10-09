import TikTokApi from "..";
import { InvalidResponseException } from "../errors";
import Video from "./video";

class User {
  static parent: TikTokApi;
  user_id?: string;
  sec_uid?: string;
  username?: string;
  as_dict?: Record<string, any>;

  constructor({
    username,
    user_id,
    sec_uid,
    data,
  }: {
    username?: string;
    user_id?: string;
    sec_uid?: string;
    data?: Record<string, any>;
  }) {
    this.__update_id_sec_uid_username({
      username: username,
      sec_uid: sec_uid,
      id: user_id,
    });
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
    const username = this.username;
    if (!username) {
      throw new TypeError(
        "You must provide the username when creating this class to use this method."
      );
    }

    const sec_uid = this.sec_uid || "";
    const url_params = {
      secUid: sec_uid,
      uniqueId: username,
      msToken: ms_token,
    };

    const resp = await User.parent.make_request({
      url: "https://www.tiktok.com/api/user/detail/",
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

  async videos({
    count = 30,
    cursor = 0,
    ...kwargs
  }: {
    count?: number;
    cursor?: number;
    headers?: Record<string, any>;
    session_index?: number;
  }): Promise<Video[]> {
    const sec_uid = this.sec_uid || "";
    if (!sec_uid) {
      await this.info({
        headers: kwargs.headers,
        session_index: kwargs.session_index,
      });
    }

    let found = 0;
    const videos = [];

    while (found < count) {
      const params = {
        secUid: this.sec_uid,
        count: 35,
        cursor: cursor,
      };

      const resp = await User.parent.make_request({
        url: "https://www.tiktok.com/api/post/item_list/",
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
        videos.push(new User.parent.video({ data: video }));
        found += 1;
      }

      if (!resp.hasMore) {
        break;
      }

      cursor = resp.cursor;
    }
    return videos;
  }

  async *liked({
    count = 30,
    cursor = 0,
    ...kwargs
  }: {
    count: number;
    cursor: number;
    headers?: Record<string, any>;
    session_index?: number;
  }): AsyncGenerator<Video, void, unknown> {
    const sec_uid = this.sec_uid;
    if (!sec_uid) {
      await this.info({
        headers: kwargs.headers,
        session_index: kwargs.session_index,
      });
    }

    let found = 0;
    while (found < count) {
      const params = {
        secUid: this.sec_uid,
        count: 35,
        cursor: cursor,
      };

      const resp = await User.parent.make_request({
        url: "https://www.tiktok.com/api/favorite/item_list",
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
        yield new User.parent.video({ data: video });
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

    if ("userInfo" in keys) {
      this.__update_id_sec_uid_username({
        id: data.userInfo.user.id,
        sec_uid: data.userInfo.user.secUid,
        username: data.userInfo.user.uniqueId,
      });
    } else {
      this.__update_id_sec_uid_username({
        id: data.id,
        sec_uid: data.secUid,
        username: data.uniqueId,
      });
    }

    if (!this.username || !this.user_id || !this.sec_uid) {
      User.parent.logger.error(
        `Failed to create User with data: ${data}\nwhich has keys ${keys}`
      );
    }
  }

  private __update_id_sec_uid_username({
    id,
    sec_uid,
    username,
  }: {
    id?: string;
    sec_uid?: string;
    username?: string;
  }) {
    this.user_id = id;
    this.sec_uid = sec_uid;
    this.username = username;
  }

  toString() {
    const username = this.username;
    const user_id = this.user_id;
    const sec_uid = this.sec_uid;
    return `TikTokApi.user(username='${username}', user_id='${user_id}', sec_uid='${sec_uid}')`;
  }
}

export default User;
