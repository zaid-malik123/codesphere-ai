import { useContext, useState } from "react"
import { UserDataContext } from "../context/UserContext"
import { FaPlus } from "react-icons/fa6";
import axios from "axios"

const Home = () => {
  const { user: _user } = useContext(UserDataContext)
  const [showModal, setShowModal] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
      console.log(res.data)
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

  return (
    <div>
      <main className="p-4 bg-black min-h-screen w-full">
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <FaPlus />
            New Project
          </button>
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
