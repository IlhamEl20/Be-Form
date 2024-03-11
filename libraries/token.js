import Dotenv from "dotenv";
import Jsonwebtoken from "jsonwebtoken";

const env = Dotenv.config().parsed;

class Token {
  async AccessToken(payload) {
    return Jsonwebtoken.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXP_TIME,
    });
  }

  async RefreshToken(payload) {
    return Jsonwebtoken.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXP_TIME,
    });
  }
}
export default Token;
