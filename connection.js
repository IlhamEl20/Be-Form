import dotenv from "dotenv";
import mongoose from "mongoose";

const env = dotenv.config().parsed;
// const db = () => {
//   mongoose.connect(env.MONGODB_URL, {
//     dbName: env.MONGODB_NAME,
//   });
const db = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.MONGODB_NAME,
  });
  const conection = mongoose.connection;
  conection.on("error", console.error.bind(console, "connection error :"));
  conection.once("open", () => {
    console.log(`konek mongodb database name ${process.env.MONGODB_NAME}`);
  });
};
export default db;
