import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SideBar from "../components/SideBar"

const Project = () => {
  const {projectId} = useParams()
  const [projectData, setProjectData] = useState(null)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/project/get-project/${projectId}`,{withCredentials:true}).then((res) => {
      setProjectData(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])
  
  return (
    <div className="h-screen w-screen flex">
       <section className="left h-full w-[30%]">
          <SideBar projectData={projectData} />
       </section>
    </div>
  )
}

export default Project
