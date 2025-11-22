import { Router } from "express";
import {
  createUserController,
  currentUserController,
  getAllUsers,
  loginUserController,
  logOutController,
  profileController,
} from "../controllers/user.controller.js";
import { body } from "express-validator";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("password must be at least 3 characters"),

  createUserController
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("password must be at least 3 characters"),

  loginUserController
);

router.get("/profile", isAuth, profileController)

router.get("/logout", isAuth ,logOutController)

router.get("/currentUser", isAuth, currentUserController)

router.get("/all", isAuth, getAllUsers)

export default router;
