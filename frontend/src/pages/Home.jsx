import { useContext } from "react"
import { UserDataContext } from "../context/UserContext"


const Home = () => {
  const { user } = useContext(UserDataContext)  
  return (
    <div>
      {user?.email}
    </div>
  )
}

export default Home
