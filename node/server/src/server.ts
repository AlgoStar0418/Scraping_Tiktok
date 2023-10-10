import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";

const PORT = process.env.PORT || 5000;
const app = express();

app
  .use(
    cors({
      origin: "*",
      methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
      allowedHeaders: ["Authorization"],
    })
  )
  .use(express.urlencoded({ extended: true }))
  .use(express.json());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
