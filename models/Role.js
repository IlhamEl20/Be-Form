import Mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = new Mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
  }
);

Schema.plugin(MongoosePaginate);

export default Mongoose.model("Roles", Schema);
