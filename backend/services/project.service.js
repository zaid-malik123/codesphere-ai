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