import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

const StartInterview = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const Qcount = localStorage.getItem("QuestionCount");

  const handleStart = async () => {
    setLoading(true);
    try {
      const storedPlan = localStorage.getItem("InterviewPlan");
      if (!storedPlan) {
        throw new Error("No InterviewPlan found in localStorage.");
      }
      const parsedPlan = JSON.parse(storedPlan);
      const response = await axios.post("http://127.0.0.1:5000/get-question", {
        sr_no: Qcount,
        interview_plan: {
          interview_plan: parsedPlan,
        },
      });
      navigate("/interview-page", { state: response.data });
    } catch (error) {
      console.error("Error starting interview:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Interview</h1>
          <p className="text-lg text-gray-600">
            You are about to begin your interview session. Make sure you are ready and click the button below to start.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105">
          <Button
            onClick={handleStart}
            disabled={loading}
            className={`w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-md transform transition-all duration-200 flex items-center justify-center ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting...
              </div>
            ) : (
              "Start Interview"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
