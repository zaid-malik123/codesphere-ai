import React, { useEffect, useState } from "react";
import { RiUserAddLine, RiSendPlane2Line, RiCloseLine } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { onSocketReady, sendMessage as socketEmit } from "../config/socket";

export default function SideBar({ projectData }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const navigate = useNavigate();

  // Listen real-time messages
 useEffect(() => {
  onSocketReady((socket) => {
    socket.on("project-message", (data) => {
      setChat((prev) => [...prev, { myself: false, text: data.message }]);
    });
  });
}, []);


  // Send message
  const handleSendMessage = () => {
    if (!message.trim()) return;

    socketEmit("project-message", {
      message,
    });

    setChat((prev) => [...prev, { myself: true, text: message }]);
    setMessage("");
  };

  return (
    <div className="w-full h-full bg-[#0f0f0f] border-r border-gray-700 flex flex-col relative text-gray-200">

      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <div onClick={() => navigate("/")}>
          <IoArrowBackSharp size={20} />
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <RiUserAddLine className="text-xl" />
          <h2 className="font-semibold text-lg">Collaborators</h2>
        </div>
      </div>

      {/* Collaborators */}
      <div
        className={`absolute top-0 left-0 w-full  h-full bg-[#1a1a1a] z-20 p-4 transition-all ${
          open ? "translate-x-0 block " : "translate-x-full hidden"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-700 pb-3">
          <h2 className="font-semibold text-lg">Your Collaborators</h2>
          <RiCloseLine
            className="text-2xl cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {projectData?.users?.map((c) => (
            <div
              key={c._id}
              className="p-3 bg-[#2a2a2a] rounded-xl text-gray-300"
            >
              {c.email}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#141414]">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[80%] shadow-sm ${
              msg.myself
                ? "bg-blue-600 text-white ml-auto"
                : "bg-[#222] text-gray-300"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700 flex items-center gap-2 bg-[#0f0f0f]">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-[#1f1f1f] border border-gray-600 text-gray-200 rounded-full"
        />

        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white p-3 rounded-full"
        >
          <RiSendPlane2Line className="text-xl" />
        </button>
      </div>
    </div>
  );
}
