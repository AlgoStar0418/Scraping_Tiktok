import React from "react";
import { Link } from "react-router-dom";

const AllAgents = () => {
  return (
    <div className="max-w-[80rem] gap-5 flex flex-col items-center justify-center h-[calc(100vh-10rem)] mx-auto px-5 mt-10">
      <Link to="/dashboard/agent1">
        <button className="bg-[#3c3ce7] py-2 text-lg font-medium px-5 rounded-md text-white">
          Agent 1
        </button>
      </Link>
      <Link to="/dashboard/agent2">
        <button className="bg-[#36b43c] py-2 text-lg font-medium px-5 rounded-md text-white">
          Agent 2
        </button>
      </Link>
      <Link to="/dashboard/agent3">
        <button className="bg-[#f15f4c] py-2 text-lg font-medium px-5 rounded-md text-white">
          Agent 3
        </button>
      </Link>
    </div>
  );
};

export default AllAgents;
