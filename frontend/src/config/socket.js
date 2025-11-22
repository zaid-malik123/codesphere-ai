import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = () => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_BASE_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
  }

  return socketInstance;
};
