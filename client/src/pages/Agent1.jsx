import React from "react";
import { Route, Routes } from "react-router-dom";
import ProjectsOverview from "../components/features/agent1/ProjectsOverview";
import ProjectView from "../components/features/agent1/ProjectView";

const Agent1 = () => {
  return (
    <Routes>
      <Route path="/projects" element={<ProjectsOverview />} />
      <Route path="/" element={<ProjectsOverview />} />
      <Route path="/projects/:project_id" element={<ProjectView />} />
    </Routes>
  );
};

export default Agent1;
