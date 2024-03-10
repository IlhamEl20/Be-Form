import Mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = new Mongoose.Schema(
  {
    userId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sessionId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["login", "refresh-token"],
      default: "login",
      required: true,
    },
    statusToken: {
      type: Boolean,
    },
    statusLogin: {
      type: Boolean,
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

export default Mongoose.model("UserAccess", Schema);
