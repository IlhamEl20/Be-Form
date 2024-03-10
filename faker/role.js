import Role from "../models/Role.js";
import mongoose from "mongoose";

const run = async (limit) => {
  try {
    let data = [
      {
        _id: mongoose.Types.ObjectId("64be8a3516b11f521669b279"),
        role: "Admin",
        status: "active",
      },
      {
        _id: mongoose.Types.ObjectId("64be8a5a16b11f521669b27b"),
        role: "User",
        status: "active",
      },
    ];

    const seederData = await Role.insertMany(data);
    if (seederData) {
      console.log(`${seederData.length} data Role di tambahkan`);
    }
  } catch (error) {
    console.log(error);
  }
};

export { run };
