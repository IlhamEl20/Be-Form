import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const run = async (limit) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("123456", salt);

    let data = [
      {
        _id: mongoose.Types.ObjectId("6459ca6363c9b788ac8cea29"),
        roleId: mongoose.Types.ObjectId("64be8a3516b11f521669b279"),
        fullname: "Admin",
        email: "admin@gmail.com",
        password: hash,
        status: "active",
      },
      {
        _id: mongoose.Types.ObjectId("61c43ee8a7081e9dc4628ba8"),
        roleId: mongoose.Types.ObjectId("64be8a5a16b11f521669b27b"),
        fullname: "User",
        email: "user@gmail.com",
        password: hash,
        status: "active",
      },
    ];

    const seederData = await User.insertMany(data);
    if (seederData) {
      console.log(`${seederData.length} data User di tambahkan`);
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { run };
