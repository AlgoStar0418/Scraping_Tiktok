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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const errors_1 = require("../errors");
const luxon_1 = require("luxon"); // You may need to use a date library like Luxon for datetime manipulation
const axios_1 = __importDefault(require("axios"));
class Video {
    constructor(_a) {
        var { id, url, data } = _a, kwargs = __rest(_a, ["id", "url", "data"]);
        this.id = id;
        this.url = url;
        if (data) {
            this.as_dict = data;
            this.__extract_from_data();
        }
        else if (url) {
            const [i, session] = Video.parent.get_session(Object.assign({}, kwargs));
            (0, helpers_1.extractVideoIdFromUrl)(url, {
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
    info(kwargs) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [i, session] = Video.parent.get_session(Object.assign({}, kwargs));
            const proxy = (kwargs === null || kwargs === void 0 ? void 0 : kwargs.proxy) || session.proxy;
            if (!this.url) {
                throw new TypeError("To call video.info() you need to set the video's url.");
            }
            try {
                const r = yield axios_1.default.get(this.url, {
                    headers: session.headers,
                    proxy: proxy,
                });
                // Extract JSON data from the response text
                const start = r.data.indexOf('<script id="SIGI_STATE" type="application/json">');
                if (start === -1) {
                    throw new errors_1.InvalidResponseException(r.data, "TikTok returned an invalid response.", r.status);
                }
                const end = r.data.indexOf("</script>", start);
                if (end === -1) {
                    throw new errors_1.InvalidResponseException(r.data, "TikTok returned an invalid response.", r.status);
                }
                const data = JSON.parse(r.data.slice(start, end));
                const video_info = data["ItemModule"][(_a = this.id) !== null && _a !== void 0 ? _a : ""];
                this.as_dict = video_info;
                this.__extract_from_data();
                return video_info;
            }
            catch (e) {
                throw new errors_1.InvalidResponseException(e, "TikTok returned an invalid response.", e.response.data);
            }
        });
    }
    bytes(...kwargs) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method 'bytes' not implemented yet.");
        });
    }
    __extract_from_data() {
        var _a, _b;
        const data = (_a = this.as_dict) !== null && _a !== void 0 ? _a : {};
        this.id = data["id"];
        const timestamp = data["createTime"];
        if (timestamp !== undefined) {
            this.create_time = luxon_1.DateTime.fromMillis(timestamp * 1000);
        }
        this.stats = data["stats"];
        const author = data["author"];
        if (typeof author === "string") {
            this.author = new Video.parent.user({ username: author });
        }
        else {
            this.author = new Video.parent.user({ data: author });
        }
        this.sound = new Video.parent.sound({ data: data });
        this.hashtags = (data["challenges"] || []).map((hashtagData) => {
            return new Video.parent.hashtag({ data: hashtagData });
        });
        if (this.id === undefined) {
            (_b = Video.parent) === null || _b === void 0 ? void 0 : _b.logger.error(`Failed to create Video with data: ${data}\nwhich has keys ${Object.keys(data)}`);
        }
    }
    comments(count = 20, cursor = 0, ...kwargs) {
        var _a, _b, _c;
        return __asyncGenerator(this, arguments, function* comments_1() {
            let found = 0;
            while (found < count) {
                const params = {
                    aweme_id: this.id,
                    count: 20,
                    cursor: cursor,
                };
                const resp = yield __await(((_a = Video.parent) === null || _a === void 0 ? void 0 : _a.make_request({
                    url: "https://www.tiktok.com/api/comment/list/",
                    params: params,
                    headers: (_b = kwargs.find((arg) => arg.headers !== undefined)) === null || _b === void 0 ? void 0 : _b.headers,
                    session_index: (_c = kwargs.find((arg) => arg.session_index !== undefined)) === null || _c === void 0 ? void 0 : _c.session_index,
                })));
                if (!resp) {
                    throw new errors_1.InvalidResponseException(resp, "TikTok returned an invalid response.");
                }
                for (const commentData of resp["comments"] || []) {
                    yield yield __await(new Video.parent.comment({ data: commentData }));
                    found += 1;
                }
                if (!resp["has_more"]) {
                    return yield __await(void 0);
                }
                cursor = resp["cursor"];
            }
        });
    }
    related_videos(count = 30, cursor = 0, ...kwargs) {
        var _a, _b, _c;
        return __asyncGenerator(this, arguments, function* related_videos_1() {
            let found = 0;
            while (found < count) {
                const params = {
                    itemID: this.id,
                    count: 16,
                };
                const resp = yield __await(((_a = Video.parent) === null || _a === void 0 ? void 0 : _a.make_request({
                    url: "https://www.tiktok.com/api/related/item_list/",
                    params: params,
                    headers: (_b = kwargs.find((arg) => arg.headers !== undefined)) === null || _b === void 0 ? void 0 : _b.headers,
                    session_index: (_c = kwargs.find((arg) => arg.session_index !== undefined)) === null || _c === void 0 ? void 0 : _c.session_index,
                })));
                if (!resp) {
                    throw new errors_1.InvalidResponseException(resp, "TikTok returned an invalid response.");
                }
                for (const videoData of resp["itemList"] || []) {
                    yield yield __await(new Video.parent.video({
                        data: videoData,
                    }));
                    found += 1;
                }
            }
        });
    }
    toString() {
        return `TikTokApi.video(id='${this.id}')`;
    }
}
exports.default = Video;
