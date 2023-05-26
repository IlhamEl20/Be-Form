import express from "express";
import AuthController from "../controllers/AuthController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import FormController from "../controllers/FormController.js";
const router = express.Router();
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

export default router;
