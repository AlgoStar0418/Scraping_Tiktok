"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./api/user"));
const chalk_1 = __importDefault(require("chalk"));
const video_1 = __importDefault(require("./api/video"));
const errors_1 = require("./errors");
const sound_1 = __importDefault(require("./api/sound"));
const hashtag_1 = __importDefault(require("./api/hashtag"));
const comment_1 = __importDefault(require("./api/comment"));
const trending_1 = require("./api/trending");
class TikTokPlaywrightSession {
    // constructor must have named parameters
    constructor({ context, page, proxy, params, headers, ms_token, }) {
        this.base_url = "https://www.tiktok.com";
        this.context = context;
        this.page = page;
        this.proxy = proxy;
        this.params = params;
        this.headers = headers;
        this.ms_token = ms_token;
    }
}
class TikTokApi {
    constructor(logger_name) {
        this.user = user_1.default;
        this.video = video_1.default;
        this.sound = sound_1.default;
        this.hashtag = hashtag_1.default;
        this.trending = trending_1.Trending;
        this.comment = comment_1.default;
        this.sessions = [];
        if (!logger_name) {
            logger_name = "TikTokApi";
        }
        this.logger = this.__create_logger(logger_name);
        user_1.default.parent = this;
        video_1.default.parent = this;
        sound_1.default.parent = this;
        hashtag_1.default.parent = this;
        trending_1.Trending.parent = this;
    }
    __create_logger(name) {
        return {
            debug: (msg, stack) => console.log(chalk_1.default.blueBright(`[${name}] ${msg}`) + stack
                ? chalk_1.default.blueBright(`[${name}] ${stack}`)
                : ""),
            info: (msg, stack) => console.log(chalk_1.default.greenBright(`[${name}] ${msg}`) + stack
                ? chalk_1.default.greenBright(`[${name}] ${stack}`)
                : ""),
            warn: (msg, stack) => console.log(chalk_1.default.yellowBright(`[${name}] ${msg}`) + stack
                ? chalk_1.default.yellowBright(`[${name}] ${stack}`)
                : ""),
            error: (msg, stack) => console.log(chalk_1.default.redBright(`[${name}] ${msg}`) + stack
                ? chalk_1.default.redBright(`[${name}] ${stack}`)
                : ""),
        };
    }
    __set_session_params(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_agent = yield session.page.evaluate(() => navigator.userAgent);
            const language = yield session.page.evaluate(() => navigator.language);
            const platform = yield session.page.evaluate(() => navigator.platform);
            const device_id = String(Math.floor(Math.random() * (Math.pow(10, 19) - Math.pow(10, 18)) + Math.pow(10, 18)));
            const history_len = String(Math.floor(Math.random() * 10) + 1);
            const screen_height = String(Math.floor(Math.random() * (1080 - 600 + 1)) + 600);
            const screen_width = String(Math.floor(Math.random() * (1920 - 800 + 1)) + 800);
            const timezone = yield session.page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
            const session_params = {
                aid: "1988",
                app_language: language,
                app_name: "tiktok_web",
                browser_language: language,
                browser_name: "Mozilla",
                browser_online: "true",
                browser_platform: platform,
                browser_version: user_agent,
                channel: "tiktok_web",
                cookie_enabled: "true",
                device_id: device_id,
                device_platform: "web_pc",
                focus_state: "true",
                from_page: "user",
                history_len: history_len,
                is_fullscreen: "false",
                is_page_visible: "true",
                language: language,
                os: platform,
                priority_region: "",
                referer: "",
                region: "US",
                screen_height: screen_height,
                screen_width: screen_width,
                tz_name: timezone,
                webcast_language: language,
            };
            session.params = session_params;
        });
    }
    __create_session({ url = "https://www.tiktok.com", ms_token, proxy, context_options = {}, sleep_after = 1, cookies, } = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (ms_token) {
                if (!cookies) {
                    cookies = {};
                }
                cookies["msToken"] = ms_token;
            }
            const context = yield ((_a = this.browser) === null || _a === void 0 ? void 0 : _a.newContext(Object.assign({ proxy: proxy }, context_options)));
            if (cookies) {
                const formatted_cookies = Object.entries(cookies).map(([k, v]) => ({
                    name: k,
                    value: v,
                    domain: new URL(url).hostname,
                    path: "/",
                }));
                yield (context === null || context === void 0 ? void 0 : context.addCookies(formatted_cookies));
            }
            const page = yield (context === null || context === void 0 ? void 0 : context.newPage());
            // await stealth_async(page);
            // Get the request headers to the URL
            let request_headers = undefined;
            page === null || page === void 0 ? void 0 : page.once("request", (request) => {
                request_headers = request.headers();
            });
            yield (page === null || page === void 0 ? void 0 : page.goto(url, {
                timeout: 0,
            }));
            const session = new TikTokPlaywrightSession({
                context: context,
                page: page,
                proxy: proxy,
                ms_token: ms_token,
                headers: request_headers,
            });
            if (!ms_token) {
                cookies = yield this.get_session_cookies(session);
                ms_token = cookies["msToken"];
                session.ms_token = ms_token;
                if (!ms_token) {
                    this.logger.info(`Failed to get msToken on session index ${this.sessions.length}, you should consider specifying ms_tokens`);
                }
            }
            this.sessions.push(session);
            yield this.__set_session_params(session);
            return session;
        });
    }
    createSessions({ num_sessions = 5, headless = true, ms_tokens, proxies, sleep_after = 1, starting_url = "https://www.tiktok.com", context_options = {}, override_browser_args, cookies, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.playwright = yield Promise.resolve().then(() => __importStar(require("playwright")));
            if (headless && !override_browser_args) {
                override_browser_args = ["--headless=new"];
                headless = false; // managed by the arg
            }
            this.browser = yield this.playwright.firefox.launch({
                headless: true,
                args: override_browser_args,
            });
            yield Promise.all(Array.from({ length: num_sessions }, (_, i) => this.__create_session({
                proxy: proxies ? proxies[i % proxies.length] : undefined,
                ms_token: ms_tokens ? ms_tokens[i % ms_tokens.length] : undefined,
                url: starting_url,
                context_options: context_options,
                sleep_after: sleep_after,
                cookies: cookies ? cookies[i % cookies.length] : undefined,
            })));
            this.num_sessions = this.sessions.length;
        });
    }
    get_session_cookies(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = yield session.context.cookies();
            const cookies_dict = {};
            for (const cookie of cookies) {
                cookies_dict[cookie.name] = cookie.value;
            }
            return cookies_dict;
        });
    }
    make_request(_a) {
        var { url, headers, params, retries = 3, exponential_backoff = true } = _a, kwargs = __rest(_a, ["url", "headers", "params", "retries", "exponential_backoff"]);
        return __awaiter(this, void 0, void 0, function* () {
            let [i, session] = this.get_session({
                session_index: kwargs.session_index,
            });
            if (session.params) {
                params = Object.assign(Object.assign({}, session.params), params);
            }
            if (headers) {
                headers = Object.assign(Object.assign({}, session.headers), headers);
            }
            if (!params["msToken"]) {
                if (session.ms_token) {
                    params["msToken"] = session.ms_token;
                }
                else {
                    let cookies = yield this.get_session_cookies(session);
                    let ms_token = cookies["msToken"];
                    if (!ms_token) {
                        this.logger.warn("Failed to get msToken from cookies, trying to make the request anyway (probably will fail)");
                    }
                    params[ms_token] = ms_token;
                }
            }
            const encodedParams = `${url}?${new URLSearchParams(params)}`;
            const signedUrl = yield this.signUrl(encodedParams, { session_index: i });
            let retry_count = 0;
            while (i < retries) {
                retry_count += 1;
                let result = yield this.run_fetch_script(signedUrl, {
                    headers: headers,
                    session_index: i,
                });
                if (!result) {
                    throw Error("TiktokApi.run_fetch_script returned null");
                }
                if (result === "") {
                    throw new errors_1.EmptyReponseException(result, "Response is empty");
                }
                try {
                    let data = JSON.parse(result);
                    if (data.status_code != 0) {
                        this.logger.error(`Got an unexpected status code: ${data}`);
                    }
                    return data;
                }
                catch (error) {
                    if (retry_count === retries) {
                        this.logger.error("Failed to decode json response: " + result);
                        throw new errors_1.InvalidJSONException(result, "Failed to decode json response");
                    }
                    this.logger.info(`Failed a request, retrying (${retry_count}/${retries})`);
                    if (exponential_backoff) {
                        yield new Promise((resolve) => setTimeout(resolve, 2 ** retry_count * 1000));
                    }
                    else {
                        yield new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                }
            }
        });
    }
    closeSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const session of this.sessions) {
                yield session.page.close();
                yield session.context.close();
            }
            this.sessions = [];
        });
    }
    stopPlaywright() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.browser) === null || _a === void 0 ? void 0 : _a.close());
        });
    }
    getSessionContent(url, kwargs) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_, session] = this.get_session(kwargs);
            return yield session.page.content();
        });
    }
    withApi(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield callback(this);
            }
            finally {
                yield this.closeSessions();
                yield this.stopPlaywright();
            }
        });
    }
    run_fetch_script(url, _a) {
        var { headers } = _a, kwargs = __rest(_a, ["headers"]);
        return __awaiter(this, void 0, void 0, function* () {
            const [_, session] = this.get_session(Object.assign({}, kwargs));
            let data = { url, headers };
            let result = yield session.page.evaluate(({ url, headers }) => {
                return new Promise((resolve, reject) => {
                    fetch(url, { method: "GET", headers: JSON.stringify(headers) })
                        .then((response) => response.text())
                        .then((data) => resolve(data))
                        .catch((error) => reject(error.message));
                });
            }, data);
            return result;
        });
    }
    signUrl(url, _a) {
        var kwargs = __rest(_a, []);
        return __awaiter(this, void 0, void 0, function* () {
            const [i, session] = this.get_session(Object.assign({}, kwargs));
            let x_bogus = yield this.generate_x_bogus(url, { session_index: i });
            if (!x_bogus) {
                throw Error("Failed to generate x-Bogus");
            }
            if (url.includes("?")) {
                url += "&";
            }
            else {
                url += "?";
            }
            let bogus = x_bogus["X-Bogus"];
            url += `X-Bogux=${bogus}`;
            return url;
        });
    }
    generate_x_bogus(url, _a) {
        var kwargs = __rest(_a, []);
        return __awaiter(this, void 0, void 0, function* () {
            let [_, session] = this.get_session(Object.assign({}, kwargs));
            const result = yield session.page.evaluate((url) => {
                return window.byted_acrawler.frontierSign(`${url}`);
            }, url);
            return result;
        });
    }
    get_session(_a) {
        var kwargs = __rest(_a, []);
        let i;
        if (kwargs.session_index) {
            i = kwargs.session_index;
        }
        else {
            i = Math.floor(Math.random() * this.sessions.length);
        }
        return [i, this.sessions[i]];
    }
}
exports.default = TikTokApi;
