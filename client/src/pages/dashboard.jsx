import React, { useEffect } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import DashboardHeader from "../components/headers/dashboard";
import Notfound from "./Notfound";
import toast from "react-hot-toast";
import AuthService from "../services/auth.service";
import { useRecoilState } from "recoil";
import { User } from "../lib/atom";
import { Oval } from "react-loader-spinner";
import Agent1 from "./Agent1";
import Agent3 from "./Agent3";
import { Button, Tooltip } from "antd";
import Agent2 from "./Agent2";

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
  let { "*": currentAgent } = useParams();
  const agents = [
    {
      value: "agent1",
      name: "Agent 1",
      path: "/agent1",
    },
    {
      value: "agent2",
      name: "Agent 2",
      path: "/agent2",
    },
    {
      value: "agent3",
      name: "Agent 3",
      path: "/agent3",
    },
  ];
  if (currentAgent === "") {
    currentAgent = "agent1";
  }
  if (currentAgent.length > 5) {
    let agentArray = currentAgent.split("/");
    currentAgent = agentArray[0];
  }
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
        <div className="flex mb-4 gap-4">
          {agents.map((agent, index) =>
            agent.value === "agent2" ? (
              currentAgent === "agent2" ? (
                <Link key={index} to={agent.path}>
                  <Button
                    className={` ${
                      currentAgent === agent.value
                        ? "bg-[#5a5aff] text-white"
                        : ""
                    }  `}
                    size="large"
                    type={currentAgent === agent.value ? "primary" : "default"}
                  >
                    {agent.name}
                  </Button>
                </Link>
              ) : (
                <Tooltip title="You must first go to Agent 1 and Scrap">
                  <Button
                  size="large"
                  disabled
                  >{agent.name}</Button>
                </Tooltip>
              )
            ) : (
              <Link key={index} to={agent.path}>
                <Button
                  className={` ${
                    currentAgent === agent.value
                      ? "bg-[#5a5aff] text-white"
                      : ""
                  }`}
                  size="large"
                  type={currentAgent === agent.value ? "primary" : "default"}
                >
                  {agent.name}
                </Button>
              </Link>
            )
          )}
        </div>

        <Routes>
          <Route path="/" element={<Agent1 />} />
          <Route path="/agent1/*" element={<Agent1 />} />
          <Route path="/agent2" element={<Agent2 />} />
          <Route path="/agent3" element={<Agent3 />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
