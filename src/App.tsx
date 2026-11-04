import { BrowserRouter, Route, Routes } from "react-router";
import { MotionConfig, LazyMotion, domAnimation } from "motion/react";
import { SiteLayout } from "./components/layout/SiteLayout";
import { FoundationPage } from "./pages/FoundationPage";
import { HomePage } from "./pages/HomePage";
import { SkillsPage } from "./pages/SkillsPage";
import { ProjectPage, ProjectsPage } from "./pages/ProjectPage";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="skills" element={<SkillsPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:slug" element={<ProjectPage />} />
              <Route path="*" element={<FoundationPage kind="missing" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LazyMotion>
    </MotionConfig>
  );
}
