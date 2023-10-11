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
exports.api = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chalk_1 = __importDefault(require("chalk"));
const http_1 = __importDefault(require("http"));
const tiktok_1 = __importDefault(require("./services/tiktok"));
const index_route_1 = __importDefault(require("./routes/index.route"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app
    .use(express_1.default.json())
    .use(express_1.default.urlencoded({ extended: true }))
    .use((0, cors_1.default)())
    .use("/api", index_route_1.default);
const server = http_1.default.createServer(app);
exports.api = new tiktok_1.default();
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chalk_1.default.green(`Server is listening on port ${port}`));
    yield exports.api.createSessions({ num_sessions: 1, headless: false });
    console.log(chalk_1.default.green(`TikTok sessions created`));
}));
