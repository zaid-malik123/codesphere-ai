import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_BASE_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        projectId,
      },
    });
  }

  return socketInstance;
};

// Wait until socket is initialized
export const onSocketReady = (callback) => {
  const interval = setInterval(() => {
    if (socketInstance) {
      clearInterval(interval);
      callback(socketInstance);
    }
  }, 100);
};

export const sendMessage = (eventName, data) => {
  if (!socketInstance) return;
  socketInstance.emit(eventName, data);
};
