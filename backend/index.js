//import packages
import express from "express"
import morgan from "morgan"

//import files
import { connectDb } from "./db/db.js"
import userRoutes from "./routes/user.routes.js"

const app = express()

// middlewares
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//routes
app.use("/api/users", userRoutes)

// data base connectivity 
connectDb()

// export app
export default app;