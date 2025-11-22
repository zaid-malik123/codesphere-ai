import { validationResult } from "express-validator";
import { addUsersToProjects, createProject } from "../services/project.service.js";
import Project from "../models/project.model.js";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;

    const userId = req.userId;

    const newProject = await createProject({ name, userId });

    return res.status(201).json(newProject);
  } catch (error) {
    // Check for duplicate project error
    if (error.message.includes("already exists")) {
      return res.status(409).json({ message: error.message });
    }
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const getAllProjectController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json("userId is required");
    }

    const projects = await Project.find({ users: userId });

    if (!projects) {
      return res.status(400).json("This user does not create any project");
    }

    return res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.userId;

    // FIX: object destructuring (NOT array destructuring)
    const { users, projectId } = req.body;

    console.log("Incoming data:", req.body);

    const project = await addUsersToProjects({ users, projectId, userId });

    return res.status(200).json(project);

  } catch (error) {
    console.log(error);
    // Map duplicate-user error to 409 Conflict
    if (error.message && error.message.includes("already exists")) {
      return res.status(409).json({ message: error.message });
    }

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

