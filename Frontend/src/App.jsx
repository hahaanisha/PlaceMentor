/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, Component } from "react";
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

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '5px',
          margin: '20px'
        }}>
          <h2>Something went wrong!</h2>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div>Loading...</div>
  </div>
);

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
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
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
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;