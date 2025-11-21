import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/users/currentUser",
        { withCredentials: true }
      );

      console.log(res.data);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const data = {
    user,
    setUser,
  };

  return (
    <UserDataContext.Provider value={data}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
