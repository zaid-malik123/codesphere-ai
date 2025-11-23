import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import MainFeed from "../components/MainFeed";
import { initializeSocket } from "../config/socket";

const Project = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/api/project/get-project/${projectId}`,
        { withCredentials: true }
      )
      .then((res) => {
        setProjectData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [projectId]);

  useEffect(() => {
    const socket = initializeSocket(projectId);

    return () => {
      socket.disconnect();
    };
  }, [projectId]);

  return (
    <div className="h-screen w-screen flex bg-black">
      <section className="left h-full w-[30%]">
        <SideBar projectData={projectData} />
      </section>

      <section className="right h-full w-[70%] ">
        <MainFeed />
      </section>
    </div>
  );
};

export default Project;
