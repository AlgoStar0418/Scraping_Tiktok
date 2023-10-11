import TikTokApi from "..";
import User from "./user";

class Comment {
  static parent: TikTokApi;

  id?: string;
  author?: User;
  text?: string;
  likes_count?: number;
  as_dict: any;

  constructor(data: any | undefined = undefined) {
    if (data !== undefined) {
      this.as_dict = data;
      this.__extract_from_data();
    }
  }

  private __extract_from_data() {
    const data = this.as_dict;
    this.id = this.as_dict.cid;
    this.text = this.as_dict.text;

    const usr = this.as_dict.user;
    this.author = new Comment.parent.user({
      user_id: usr.uid,
      username: usr.unique_id,
      sec_uid: usr.sec_uid,
    });
    this.likes_count = this.as_dict.digg_count;
  }

  toString() {
    const id = this.id || "";
    const text = this.text || "";
    return `TikTokApi.comment(comment_id='${id}', text='${text}')`;
  }
}

export default Comment;
