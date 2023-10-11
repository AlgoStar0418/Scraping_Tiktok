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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
class Sound {
    constructor({ id, data }) {
        this.id = id;
        if (data) {
            this.as_dict = data;
            this.__extract_from_data();
        }
        else if (!id) {
            throw TypeError("You must provide id paremeter.");
        }
        else {
            this.id = id;
        }
    }
    info({ ms_token, headers, session_index, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.id;
            if (!id) {
                throw new Error("You must provide an id when creating this class to use this method.");
            }
            const url_params = {
                msToken: ms_token,
                musicId: id,
            };
            const resp = yield Sound.parent.make_request({
                url: "https://www.tiktok.com/api/music/detail/",
                params: url_params,
                headers: headers,
                session_index: session_index,
            });
            if (!resp) {
                throw new errors_1.InvalidResponseException(resp, "TikTok returned an invalid response.");
            }
            this.as_dict = resp;
            this.__extract_from_data();
            return resp;
        });
    }
    videos({ count = 30, cursor = 0, headers, session_index, }) {
        return __asyncGenerator(this, arguments, function* videos_1() {
            const id = this.id;
            if (!id) {
                throw new Error("You must provide an id when creating this class to use this method.");
            }
            let found = 0;
            const videos = [];
            while (found < count) {
                const params = {
                    musicID: id,
                    count: 30,
                    cursor: cursor,
                };
                const resp = yield __await(Sound.parent.make_request({
                    url: "https://www.tiktok.com/api/music/item_list/",
                    params: params,
                    headers: headers,
                    session_index: session_index,
                }));
                if (!resp) {
                    throw new errors_1.InvalidResponseException(resp, "TikTok returned an invalid response.");
                }
                for (const video of resp.itemList || []) {
                    videos.push(new Sound.parent.video({ data: video }));
                    found += 1;
                }
                if (!resp.hasMore) {
                    return yield __await(void 0);
                }
                cursor = resp.cursor;
            }
        });
    }
    __extract_from_data() {
        const data = this.as_dict;
        const keys = Object.keys(data);
        if ("musicInfo" in keys) {
            const author = data.musicInfo.author;
            if (typeof author === "object") {
                this.author = new Sound.parent.user({ data: author });
            }
            else if (typeof author === "string") {
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
exports.default = Sound;
