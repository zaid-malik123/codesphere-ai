import {  generateResult } from "../services/ai.service.js";


export const genContent = async (req, res) => {
try {
    const {prompt} = req.body;
    const result = await generateResult(prompt)

    return res.status(200).json(result)
} catch (error) {
    console.log(error)
}
}