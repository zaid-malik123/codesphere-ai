import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const isAuth = async (req, res, next) => {
  try {
    
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlackListed = await redisClient.get(token)
    if(isBlackListed){
      
      res.cookie("token", "")

      return res.status(401).json({
        message: "This token is expired"
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
