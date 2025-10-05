
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InterviewSetup from "./pages/dashboard/InterviewSetup";
import ResumeUploader from "./pages/dashboard/ResumeUpload";
import StartInterview from "./pages/dashboard/StartInterview";
import InterviewPage from "./pages/dashboard/InterviewPage";
import InterviewSummary from "./pages/dashboard/InterviewSummary";
import HomePage from "./pages/dashboard/HomePage";
import CoverLetterPage from "./pages/dashboard/CoverLetterPage";
import ATSPage from "./pages/dashboard/ATSPage"; // Adjust path if needed


import PropTypes from "prop-types";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import "./App.css";

// Clerk theme customization
const clerkAppearance = {
  variables: {
    colorPrimary: "#22c55e", // Tailwind green-500
    colorText: "#000000",
    colorBackground: "#ffffff",
    borderRadius: "8px",
    fontFamily: "Inter, sans-serif",
  },
  elements: {
    card: "shadow-xl border border-gray-200",
    headerTitle: "text-lg font-semibold text-green-600",
    formButtonPrimary: "bg-green-500 hover:bg-green-600 text-white",
  },
};

// Route protection component
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
          element={
            <SignIn
              routing="path"
              path="/sign-in"
              appearance={clerkAppearance}
            />
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <SignUp
              routing="path"
              path="/sign-up"
              appearance={clerkAppearance}
            />
          }
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
        <Route
          path="/interview-summary"
          element={
            <ProtectedRoute>
              <InterviewSummary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ats"
          element={
            <ProtectedRoute>
              <ATSPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coverletter"
          element={
            <ProtectedRoute>
              <CoverLetterPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
