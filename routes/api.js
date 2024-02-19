import express from "express";
import AuthController from "../controllers/AuthController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import FormController from "../controllers/FormController.js";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
import QuestionController from "../controllers/QuestionController.js";
import OptionController from "../controllers/OptionController.js";
import AnswerController from "../controllers/AnswerController.js";
import InviteController from "../controllers/InviteController.js";
import ResponseController from "../controllers/ResponseController.js";
const router = express.Router();
//Swagger
const require = createRequire(import.meta.url);
const swaggerDocument = require("../swagger.json");
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

//auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);

//form
router.get("/forms", jwtAuth(), FormController.index);
router.post("/forms", jwtAuth(), FormController.store);
router.get("/forms/:id", jwtAuth(), FormController.show);
router.put("/forms/:id", jwtAuth(), FormController.update);
router.delete("/forms/:id", jwtAuth(), FormController.destroy);
router.get("/forms/:id/users", jwtAuth(), FormController.showToUser);

//Question
router.get("/forms/:id/questions", jwtAuth(), QuestionController.index);
router.post("/forms/:id/questions", jwtAuth(), QuestionController.store);
router.put(
  "/forms/:id/questions/:questionId",
  jwtAuth(),
  QuestionController.update
);
router.delete(
  "/forms/:id/questions/:questionId",
  jwtAuth(),
  QuestionController.destroy
);

// OPTION
router.post(
  "/forms/:id/questions/:questionId/options",
  jwtAuth(),
  OptionController.store
);
router.put(
  "/forms/:id/questions/:questionId/options/:optionId",
  jwtAuth(),
  OptionController.update
); //update options
router.delete(
  "/forms/:id/questions/:questionId/options/:optionId",
  jwtAuth(),
  OptionController.destroy
); //update options

//Answers
router.post("/answers/:formId", jwtAuth(), AnswerController.store);

//invites
router.post("/forms/:id/invites", jwtAuth(), InviteController.store);
router.delete("/forms/:id/invites", jwtAuth(), InviteController.destroy);
router.get("/forms/:id/invites", jwtAuth(), InviteController.index);

//Response
router.get("/responses/:formId/lists", jwtAuth(), ResponseController.lists);
router.get(
  "/responses/:formId/summaries",
  jwtAuth(),
  ResponseController.summaries
);

export default router;
