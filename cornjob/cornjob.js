import UserAccess from "../models/UserAccess.js";
import cron from "node-cron";

// Define and schedule the cron job
cron.schedule("0 0 * * *", async () => {
  // cron.schedule("*/2 * * * *", async () => {
  try {
    // Find and update documents where type is "login" and statusLogin is true
    await UserAccess.updateMany(
      { type: "login", statusLogin: true },
      { $set: { statusLogin: false } }
    );
    console.log("StatusLogin updated successfully.");
  } catch (err) {
    console.error("Error updating statusLogin:", err);
  }
});

export default cron;
