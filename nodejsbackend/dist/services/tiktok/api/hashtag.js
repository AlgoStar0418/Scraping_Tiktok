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
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
class Hashtag {
    constructor({ name, id, data, }) {
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
    info({ ms_token, headers, session_index, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.name) {
                throw new Error("You must provide the name when creating this class to use this method.");
            }
            const url_params = {
                challengeName: this.name,
                msToken: ms_token,
            };
            const resp = yield Hashtag.parent.make_request({
                url: "https://www.tiktok.com/api/challenge/detail/",
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
    videos(_a) {
        var { count = 30, cursor = 0 } = _a, kwargs = __rest(_a, ["count", "cursor"]);
        return __asyncGenerator(this, arguments, function* videos_1() {
            let id = this.id;
            if (!id) {
                yield __await(this.info(Object.assign({}, kwargs)));
            }
            let found = 0;
            const videos = [];
            while (found < count) {
                const params = {
                    challengeID: this.id,
                    count: 30,
                    cursor: cursor,
                };
                const resp = yield __await(Hashtag.parent.make_request({
                    url: "https://www.tiktok.com/api/challenge/item_list/",
                    params: params,
                    headers: kwargs.headers,
                    session_index: kwargs.session_index,
                }));
                if (!resp) {
                    throw new errors_1.InvalidResponseException(resp, "TikTok returned an invalid response.");
                }
                for (const video of resp.itemList || []) {
                    videos.push(new Hashtag.parent.video({ data: video }));
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
        var _a;
        const data = (_a = this.as_dict) !== null && _a !== void 0 ? _a : {};
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
            Hashtag.parent.logger.error(`Failed to create Hashtag with data: ${data}\nwhich has keys ${keys}`);
        }
    }
    toString() {
        return `TikTokApi.hashtag(id='${this.id}', name='${this.name}')`;
    }
}
exports.default = Hashtag;
