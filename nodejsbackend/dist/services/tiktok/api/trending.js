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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trending = void 0;
const errors_1 = require("../errors");
class Trending {
    static videos(_a) {
        var { count = 10 } = _a, kwargs = __rest(_a, ["count"]);
        return __awaiter(this, void 0, void 0, function* () {
            let found = 0;
            const videos = [];
            while (found < count) {
                const params = Object.assign({ from_page: "fyp", count: count }, kwargs);
                const resp = yield Trending.parent.make_request({
                    url: "https://www.tiktok.com/api/recommend/item_list/",
                    params,
                    headers: kwargs.headers,
                    session_index: kwargs.session_index,
                });
                if (resp === null) {
                    throw new errors_1.InvalidResponseException(resp, "TikTok returned an invalid response.");
                }
                for (const videoData of resp.itemList || []) {
                    videos.push(new Trending.parent.video({ data: videoData }));
                    found++;
                }
                if (!resp.hasMore) {
                    break;
                }
            }
            return videos;
        });
    }
}
exports.Trending = Trending;
