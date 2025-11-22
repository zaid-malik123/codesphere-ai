import React, { useState } from "react";
import { RiUserAddLine, RiSendPlane2Line, RiCloseLine } from "react-icons/ri";

export default function SideBar({ projectData }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-full bg-[#0f0f0f] border-r border-gray-700 flex flex-col relative overflow-hidden text-gray-200">
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-blue-400"
          onClick={() => setOpen(true)}
        >
          <RiUserAddLine className="text-xl" />
          <h2 className="font-semibold text-lg">Collaborators</h2>
        </div>
      </div>

      {/* Collaborators Panel */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-[#1a1a1a] shadow-xl z-20 p-4 flex flex-col gap-4 transition-all duration-300 ease-out transform
        ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="flex items-center justify-between border-b border-gray-700 pb-3">
          <h2 className="font-semibold text-lg">Your Collaborators</h2>
          <RiCloseLine
            className="text-2xl cursor-pointer hover:text-blue-400"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="flex flex-col gap-3">
          {projectData?.users?.map((c) => (
            <div
              key={c._id}
              className="p-3 bg-[#2a2a2a] rounded-xl shadow-sm text-gray-300"
            >
              {c.email}
            </div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#141414]">
        <div className="bg-[#222] p-3 rounded-xl shadow-sm max-w-[80%] text-gray-300">
          Hello there 👋
        </div>
        <div className="bg-blue-600 text-white p-3 rounded-xl shadow-sm max-w-[80%] ml-auto">
          Hi! How can I help?
        </div>
        <div className="bg-[#222] p-3 rounded-xl shadow-sm max-w-[80%] text-gray-300">
          I need the sidebar UI
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700 flex items-center gap-2 bg-[#0f0f0f]">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-[#1f1f1f] border border-gray-600 text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700">
          <RiSendPlane2Line className="text-xl" />
        </button>
      </div>
    </div>
  );
}
