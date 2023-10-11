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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomChoice = exports.extractVideoIdFromUrl = void 0;
const errors_1 = require("../errors");
const axios_1 = __importDefault(require("axios"));
const http_proxy_agent_1 = require("http-proxy-agent");
function extractVideoIdFromUrl(url, headers = {}, proxy) {
    return __awaiter(this, void 0, void 0, function* () {
        const axiosConfig = {
            method: "HEAD",
            headers,
            maxRedirects: 5,
            httpAgent: proxy ? new http_proxy_agent_1.HttpProxyAgent(proxy) : undefined,
            validateStatus: (status) => status < 400, // Only consider status codes less than 400 as success
        };
        try {
            const response = yield (0, axios_1.default)(url, axiosConfig);
            if (response.status < 400) {
                return response.request.res.responseUrl;
            }
            else {
                throw new errors_1.InvalidURLException("URL format not supported. Below is an example of a supported URL:\n" +
                    "https://www.tiktok.com/@therock/video/6829267836783971589");
            }
        }
        catch (error) {
            throw new errors_1.TikTokApiException(`Failed to fetch URL: ${url}. ${error.message}`);
        }
    });
}
exports.extractVideoIdFromUrl = extractVideoIdFromUrl;
function randomChoice(choices) {
    if (!choices || choices.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}
exports.randomChoice = randomChoice;
