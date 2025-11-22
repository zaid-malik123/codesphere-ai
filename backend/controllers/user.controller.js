import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import { createUser } from "../services/user.service.js";
import { genToken } from "../config/Token.js";
import bcrypt from "bcrypt";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "User already exist please login" });
    }

    const user = await createUser(req.body);

    const token = genToken(user._id.toString());
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const loginUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = genToken(user._id.toString());
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const profileController = async (req, res) => {
  try {
    console.log(req.user);
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const logOutController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    await redisClient.set(token, "logout", "EX", 3 * 24 * 60 * 60);

    res.status(200).json({
      message: "logout successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const currentUserController = async (req, res) => {
  try {
    const userId = req.userId;
 
    if (!userId) {
      return res.status(400).json("Please provide any user ID");
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json("This user does not exist");
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userId = req.userId
    const users = await User.find({_id : {$ne : userId}})
    
    return res.status(200).json(users)
    
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}