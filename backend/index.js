//import packages
import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors"

//import files
import { connectDb } from "./db/db.js"
import userRoutes from "./routes/user.routes.js"
import projectRoutes from "./routes/project.routes.js"

const app = express()

// middlewares
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials:true
    }
))

//routes
app.use("/api/users", userRoutes)
app.use("/api/project", projectRoutes)

// data base connectivity 
connectDb()

// export app
export default app;