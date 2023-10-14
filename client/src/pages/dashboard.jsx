import React, { useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/headers/dashboard";
import ProjectsOverview from "../components/features/agent1/ProjectsOverview";
import Notfound from "./Notfound";
import ProjectView from "../components/features/agent1/ProjectView";
import toast from "react-hot-toast";
import AuthService from "../services/auth.service";
import { useRecoilState } from "recoil";
import { User } from "../lib/atom";
import { Oval } from "react-loader-spinner";
import { Button } from "antd";
import AllAgents from "./AllAgents";
import Agent1 from "./Agent1";
import Agent3 from "./Agent3";

const Dashboard = () => {
  const [user, setUser] = useRecoilState(User);
  const navigate = useNavigate();
  useEffect(() => {
    toast.promise(AuthService.me(), {
      loading: "Loading...",
      success: (data) => {
        setUser(data);
        return "Loaded your account successfully";
      },
      error: (err) => {
        navigate("/auth/login");
        return (
          <div className="flex gap-2 p-1 flex-col">
            <div className="text-red-500 font-semibold test-sm">
              Error occured, While opening loading your account
            </div>
            <div>
              {err.name === "AxiosError" &&
              err.message === "Network Error" &&
              err.code === "ERR_NETWORK"
                ? "Server is not found."
                : "You'll have to log in again"}{" "}
            </div>
          </div>
        );
      },
    });
  }, []);
  document.title = "Dashboard | AI Agent";
  return !user ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Oval
        height={80}
        width={80}
        color="#4fa94d"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#4fa94d"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  ) : (
    <div>
      <DashboardHeader />
      <div className="max-w-[80rem] mx-auto px-5 mt-10">
        <Routes>
          <Route path="/" element={<AllAgents />} />
          <Route path="/agent1/*" element={<Agent1 />} />
          <Route path="/agent3" element={<Agent3 />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
