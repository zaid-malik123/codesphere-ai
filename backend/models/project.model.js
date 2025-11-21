import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

   name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
   },

   users: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   ]

}, {timestamps: true})

// Compound unique index: same user cannot have two projects with same name
projectSchema.index({ name: 1, users: 1 }, { unique: true })

const Project = mongoose.model("Project", projectSchema)
export default Project
