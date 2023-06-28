import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
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
    strict: false,
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
  }
);
export default mongoose.model("Answer", Schema);
