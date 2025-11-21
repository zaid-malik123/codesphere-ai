import jwt from "jsonwebtoken";

export const genToken = (userId) => { 
  try {
    const token = jwt.sign({ userId}, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};