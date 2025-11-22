import { Router } from "express";
import {
  addUserToProject,
  createProjectController,
  getAllProjectController,
  getProjectById,
} from "../controllers/project.controller.js";
import { body } from "express-validator";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.post(
  "/create",
  isAuth,
  body("name").isString().withMessage("Name is required"),
  createProjectController
);

router.get("/all", isAuth, getAllProjectController);

router.put(
  "/add-user",
  body("projectId").isString().withMessage("Project ID is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array")
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("Each user must be a string"),

  isAuth,
  addUserToProject
);

router.get("/get-project/:projectId", isAuth, getProjectById)


export default router;
