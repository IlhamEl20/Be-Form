import express from "express";
import dotenv from "dotenv";
import apiRouter from "./routes/api.js";
import db from "./connection.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cronJob from "./cornjob/cornjob.js";

const env = dotenv.config().parsed;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = process.env.CORS_ORIGIN.split(",");
// app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(
  cors({
    origin: function (origin, callback) {
      // Memeriksa apakah origin yang diminta ada dalam daftar domain yang diizinkan
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
  })
);

// Set up rate limiter: maximum of twenty requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

console.log(limiter);
// Apply rate limiter to all requests
app.use(limiter);
app.use("/", apiRouter);
//eror 404
app.use((req, res) => {
  res.status(404).json({ message: "404 NOT FOUND" });
});
//database
db();
// cronJob.getTasks();

app.listen(process.env.APP_PORT, () => {
  console.log(`server start ${process.env.APP_PORT}`);
});
