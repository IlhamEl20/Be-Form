import express from "express";
import dotenv from "dotenv";
import apiRouter from "./routes/api.js";
import db from "./connection.js";
import cors from "cors";

const env = dotenv.config().parsed;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "url" }));

app.use("/", apiRouter);
//eror 404
app.use((req, res) => {
  res.status(404).json({ message: "404 NOT FOUND" });
});
//database
db();

app.listen(env.APP_PORT, () => {
  console.log(`server start ${env.APP_PORT}`);
});
