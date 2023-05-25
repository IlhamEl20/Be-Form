import User from "../models/User.js";

const emailExist = async (email) => {
  const user = await User.findOne({ email: email });
  if (user) {
    return true;
  }
  return false;
};
export default emailExist;
