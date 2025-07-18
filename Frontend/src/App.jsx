import { BrowserRouter, Routes, Route } from "react-router-dom";
import InterviewSetup from "./pages/dashboard/InterviewSetup";
import ResumeUploader from "./pages/dashboard/ResumeUpload";
import StartInterview from "./pages/dashboard/StartInterview";
import InterviewPage from "./pages/dashboard/InterviewPage";
import HomePage from "./pages/dashboard/HomePage";
import PropTypes from "prop-types";

import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import "./App.css";

const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/sign-in/*"
          element={<SignIn routing="path" path="/sign-in" />}
        />
        <Route
          path="/sign-up/*"
          element={<SignUp routing="path" path="/sign-up" />}
        />

        {/* Protected Routes */}
        <Route
          path="/interview-setup"
          element={
            <ProtectedRoute>
              <InterviewSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-summary"
          element={
            <ProtectedRoute>
              <ResumeUploader />
            </ProtectedRoute>
          }
        />
        <Route
          path="/start-interview"
          element={
            <ProtectedRoute>
              <StartInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-page"
          element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
