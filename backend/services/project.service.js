import mongoose from "mongoose"
import Project from "../models/project.model.js"


export const createProject = async ({name, userId}) => {
try {

   if(!name || !userId){
    throw new Error("Name and UserId is required")
   }

   const existingProject = await Project.findOne({ name, users: userId })
   if(existingProject) {
    throw new Error("Project with this name already exists")
   }

   const project = await Project.create({
    name,
    users: [userId]
   })

    return project 

} catch (error) {
    throw new Error(error.message)
}
  
}

export const addUsersToProjects = async ({ users, projectId, userId }) => {
  try {
    if (!users || !projectId || !userId) {
      throw new Error("users, projectId & userId are required");
    }

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid projectId");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }

    // Validate user IDs in array
    if (
      !Array.isArray(users) ||
      users.some((id) => !mongoose.Types.ObjectId.isValid(id))
    ) {
      throw new Error("Invalid userId in users array");
    }

    // Check if requester belongs to this project
    const project = await Project.findOne({ _id: projectId, users: userId });

    if (!project) {
      throw new Error("User does not belong to this project");
    }

    // Detect any users that are already members and reject with a clear error
    const existingUserIds = new Set(project.users.map((id) => id.toString()));
    const duplicates = users.filter((u) => existingUserIds.has(u.toString()));

    if (duplicates.length > 0) {
      throw new Error(`Users already exists in project: ${duplicates.join(",")}`);
    }

    // Add users using $addToSet + $each
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      { $addToSet: { users: { $each: users } } },
      { new: true }
    );

    return updatedProject;

  } catch (error) {
    throw error;
  }
};
