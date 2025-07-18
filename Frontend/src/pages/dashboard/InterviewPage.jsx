/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";

const InterviewPage = () => {
  const location = useLocation();
  const questionData = location.state;
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackRes, setFeedbackRes] = useState(null);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const Qcount = parseInt(localStorage.getItem("QuestionCount"), 10);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // ✅ Text-to-Speech function
  const speakQuestion = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    synth.speak(utterance);
  };

  // 🗣️ Automatically speak question on load
  useEffect(() => {
    if (questionData?.question) {
      speakQuestion(questionData.question);
    }
  }, [questionData]);

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(timerRef.current);
      SpeechRecognition.stopListening();
      setUserAnswer(transcript);
      setTimerActive(false);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timer]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-center mt-10">
        Your browser does not support speech recognition.
      </div>
    );
  }

  const feedbackAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://placementor-backend.onrender.com/evaluate-answer",
        {
          question: questionData.question,
          user_answer: userAnswer,
        }
      );
      setFeedbackRes(response.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartListening = () => {
    resetTranscript();
    setUserAnswer("");
    setTimer(60);
    setTimerActive(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setUserAnswer(transcript);
    setTimerActive(false);
    clearInterval(timerRef.current);
  };

  const repeatQuestion = async () => {
    // 🗣️ Just speak the same question again instead of reloading everything
    if (questionData?.question) {
      speakQuestion(questionData.question);
    }
  };

  const nextQuestion = async () => {
    setLoading(true);
    try {
      const storedPlan = localStorage.getItem("InterviewPlan");
      if (!storedPlan) throw new Error("No InterviewPlan found in localStorage.");
      const parsedPlan = JSON.parse(storedPlan);
      const newCount = Qcount + 1;
      const response = await axios.post("https://placementor-backend.onrender.com/get-question", {
        sr_no: newCount,
        interview_plan: {
          interview_plan: parsedPlan,
        },
      });
      localStorage.setItem("QuestionCount", newCount.toString());
      navigate("/interview-page", { state: response.data });
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.error("Error starting interview:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  if (!questionData || !questionData.question) {
    return <div className="text-center mt-10">No question data found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 pt-10">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto p-6">
        <div className="w-full lg:w-1/2 space-y-6">
          <Card className="w-full shadow-lg rounded-xl">
            <CardContent className="p-6 space-y-6">
              <h1 className="text-2xl font-bold text-center text-gray-800">
                Interview Question
              </h1>
              <div className="space-y-4">
                <p className="text-lg text-gray-800 font-medium">
                  <strong>Question:</strong> {questionData.question}
                </p>
                <div className="flex gap-2">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Topic: {questionData.topic}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Difficulty: {questionData.difficulty}
                  </span>
                </div>
              </div>

              {/* 🔁 Repeat Question Button */}
              <div className="text-center">
                <Button
                  onClick={repeatQuestion}
                  className="mt-4 text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  🔁 Repeat Question (Speak Again)
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="font-semibold text-xl mb-4 text-gray-800">
              Your Spoken Answer:
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg">
              {transcript || "Start speaking to see transcript..."}
            </p>
          </div>

          {userAnswer && (
            <div className="bg-green-50 p-6 rounded-xl border border-green-300">
              <h2 className="font-semibold text-xl text-green-800 mb-2">
                Saved Answer:
              </h2>
              <p className="text-green-800 whitespace-pre-wrap p-4 bg-green-100 rounded-lg">
                {userAnswer}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-6 mt-6 items-center">
            <Button
              onClick={handleStartListening}
              disabled={listening || timerActive}
              className="h-12 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              🎤 Start Speaking
            </Button>
            <Button
              onClick={handleStopListening}
              variant="destructive"
              disabled={!listening}
              className="h-12 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              🛑 Stop & Save Answer
            </Button>
            {timerActive && (
              <span className="text-xl font-mono text-blue-700">
                ⌛ {formatTime(timer)}
              </span>
            )}
          </div>

          {userAnswer && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={feedbackAnalysis}
                disabled={listening || loading}
                className="h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? "Submitting..." : "Submit Answer"}
              </Button>
            </div>
          )}
        </div>

        {feedbackRes && (
          <div className="w-full lg:w-1/2 bg-blue-50 p-6 rounded-xl border border-blue-300 shadow-md">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
              AI Feedback Summary
            </h2>
            <div className="space-y-4">
              {feedbackRes.feedback && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="mb-2 font-semibold text-lg text-blue-700">
                    🧠 Feedback:
                  </p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {feedbackRes.feedback}
                  </p>
                </div>
              )}
              {feedbackRes.correctedAnswer && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="mb-2 font-semibold text-lg text-blue-700">
                    ✅ Corrected Answer:
                  </p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {feedbackRes.correctedAnswer}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 text-gray-700">
                <p className="bg-white p-4 rounded-lg">
                  <strong>Repeat Required:</strong>{" "}
                  {feedbackRes.repeatStatus !== undefined
                    ? feedbackRes.repeatStatus
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </p>
                <p className="bg-white p-4 rounded-lg">
                  <strong>Score:</strong>{" "}
                  {feedbackRes.score !== undefined
                    ? `${feedbackRes.score} / 10`
                    : "N/A"}
                </p>
              </div>
              <div className="flex gap-4 justify-around">
                <Button
                  onClick={repeatQuestion}
                  className="cursor-pointer h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Repeat
                </Button>
                <Button
                  onClick={nextQuestion}
                  disabled={feedbackRes.score < 6}
                  className="cursor-pointer h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next Question
                </Button>
              </div>
              <p className="text-red-500">
                * You can move to next question only when score is greater than
                or equal to 6
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
