import { useContext, useEffect, useState } from "react"
import { UserDataContext } from "../context/UserContext"
import { FaPlus, FaUsers, FaFolderOpen, FaTrash, FaUserPlus } from "react-icons/fa6";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user: _user } = useContext(UserDataContext)
  const [showModal, setShowModal] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [project, setProject] = useState([])
  const navigate = useNavigate()

  const handleCreateProject = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!projectName.trim()) {
      setError("Project name is required")
      setLoading(false)
      return
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/project/create`,
        { name: projectName },
        { withCredentials: true }
      )
      setProject([...project, res.data])
      setSuccess("Project created successfully!")
      setProjectName("")
      
      setTimeout(() => {
        setShowModal(false)
        setSuccess("")
      }, 1500)
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create project"
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      axios.get(`${import.meta.env.VITE_BASE_URL}/api/project/all`, {withCredentials:true}).then((res) => {
       console.log(res.data) 
       setProject(res.data)
    }).catch((err)=> {
      console.log(err)
    })

  }, [])

  return (
    <div className="bg-black min-h-screen w-full">
      <main className="p-8 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Projects</h1>
          <p className="text-gray-400">Manage and collaborate on your projects</p>
        </div>

        {/* New Project Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition transform hover:scale-105"
          >
            <FaPlus size={18} />
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {project && project.length > 0 ? (
            project.map((proj) => (
              <div
                key={proj._id}
                className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 hover:border-blue-500 p-6 transition transform hover:scale-105 shadow-lg"
              >
                {/* Project Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaFolderOpen size={24} className="text-blue-400" />
                    <h3 className="text-xl font-bold text-white truncate">{proj.name}</h3>
                  </div>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition text-red-400 hover:text-red-300">
                    <FaTrash size={16} />
                  </button>
                </div>

                {/* Project Info */}
                <div className="mb-6 pb-4 border-b border-gray-700">
                  <p className="text-sm text-gray-400">
                    Project ID: <span className="text-gray-300 font-mono text-xs">{proj._id.slice(0, 8)}...</span>
                  </p>
                </div>

                {/* Collaborators Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FaUsers size={16} className="text-purple-400" />
                    <h4 className="font-semibold text-gray-200">
                      Collaborators ({proj.users?.length || 0})
                    </h4>
                  </div>

                  {/* Collaborators Avatar Group */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {proj.users && proj.users.length > 0 ? (
                      proj.users.slice(0, 5).map((user, idx) => (
                        <div
                          key={user._id || idx}
                          className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold border-2 border-gray-700 hover:border-blue-400 transition cursor-pointer"
                          title={user.email}
                        >
                          {user.email ? user.email.charAt(0).toUpperCase() : "?"}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No collaborators yet</p>
                    )}
                    {proj.users && proj.users.length > 5 && (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 border-2 border-gray-600">
                        +{proj.users.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium">
                    <FaUserPlus size={14} />
                    Add User
                  </button>
                  <button onClick={() => navigate(`/project/${proj._id}`)} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm font-medium">
                    Open
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <FaFolderOpen size={48} className="text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">No projects yet</p>
              <p className="text-gray-500 text-sm mb-4">Create your first project to get started</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Create Project
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            {/* Header */}
            <h2 className="text-2xl font-bold text-white mb-4">Create New Project</h2>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-200 text-sm">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setProjectName("")
                    setError("")
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
