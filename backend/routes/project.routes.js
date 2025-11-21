import { Router } from "express";
import { createProjectController } from "../controllers/project.controller.js";
import { body } from "express-validator";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.post(
  "/create",
  isAuth,
  body("name").isString().withMessage("Name is required"),
  createProjectController
);

export default router;
