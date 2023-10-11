import express from "express";
import cors from "cors";
import chalk from "chalk";
import http from "http";
import TikTokApi from "./services/tiktok";
import routes from "./routes/index.route";

const app = express();
const port = process.env.PORT || 5000;

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(cors())
  .use("/api", routes);

const server = http.createServer(app);

export const api = new TikTokApi();
server.listen(port, async () => {
  console.log(chalk.green(`Server is listening on port ${port}`));
  await api.createSessions({ num_sessions: 1, headless: false });
  console.log(chalk.green(`TikTok sessions created`));
});
