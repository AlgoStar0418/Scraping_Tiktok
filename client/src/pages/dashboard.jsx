import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardHeader from "../components/headers/dashboard";
import ProjectsOverview from "../components/features/ProjectsOverview";
import Notfound from "./Notfound";
import ProjectView from "../components/features/ProjectView";

const Dashboard = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="max-w-[80rem] mx-auto px-5 mt-10">
        <Routes>
          <Route path="/" element={<ProjectsOverview />} />
          <Route path="/projects" element={<ProjectsOverview />} />
          <Route path="/projects/*" element={<ProjectView />}/>
          <Route path="*" element={<Notfound />}/>
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
