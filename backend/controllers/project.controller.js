import { validationResult } from "express-validator";
import { createProject } from "../services/project.service.js";

export const createProjectController = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
     const { name } = req.body;

     const userId = req.userId

     const newProject = await createProject({name, userId})

     return res.status(201).json(newProject)

  } catch (error) {
    // Check for duplicate project error
    if (error.message.includes("already exists")) {
      return res.status(409).json({ message: error.message });
    }
    console.log(error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};
