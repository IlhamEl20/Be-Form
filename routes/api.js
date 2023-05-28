import express from "express";
import AuthController from "../controllers/AuthController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import FormController from "../controllers/FormController.js";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
import QuestionController from "../controllers/QuestionController.js";
const router = express.Router();
//Swagger
// const require = createRequire(import.meta.url);
// const swaggerDocument = require("../swagger.json");
// router.use("/api-docs", swaggerUi.serve);
// router.get("/api-docs", swaggerUi.setup(swaggerDocument));

//auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", jwtAuth(), AuthController.refreshToken);

//form
router.get("/forms", jwtAuth(), FormController.index);
router.post("/forms", jwtAuth(), FormController.store);
router.get("/forms/:id", jwtAuth(), FormController.show);
router.put("/forms/:id", jwtAuth(), FormController.update);
router.delete("/forms/:id", jwtAuth(), FormController.destroy);

//Question
router.get("/forms/:id/questions", jwtAuth(), QuestionController.index);
router.post("/forms/:id/questions", jwtAuth(), QuestionController.store);
router.put("/forms/:id/questions/:questionId", jwtAuth(), QuestionController.update);
router.delete("/forms/:id/questions/:questionId", jwtAuth(), QuestionController.destroy);

export default router;
