import {Router} from "express"
import { genContent } from "../controllers/ai.controller.js"
const router = Router()

router.post("/get-result", genContent)


export default router