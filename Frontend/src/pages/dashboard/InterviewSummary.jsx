// import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import InternalNavbar from "./InternalNavbar"; 

const InterviewSummary = () => {
//   const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const storedQuestions =
      JSON.parse(localStorage.getItem("InterviewQuestions")) || [];

    console.log("Stored Questions:", storedQuestions);
    setQuestions(storedQuestions);
  }, []);

  return (
    <>
      <InternalNavbar showQuitButton={false} showHomeButton={true} />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Interview Summary
        </h1>
        {questions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
            {questions.map((q, index) => (
              <Card key={index} className="shadow-md w-full">
                <CardContent className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold text-green-600">
                    Q{index + 1}
                  </h2>
                  <p className="text-gray-800">{q.question}</p>
                  <div className="flex gap-2 mt-4">
                    <span
                      className={`text-sm px-2 py-0.5 rounded ${
                        q.attempted
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {q.attempted ? "Attempted" : "Unattempted"}
                    </span>
                    <span className="text-sm bg-green-500 text-white px-2 py-0.5 rounded">
                      Marks: {q.marks != null ? q.marks : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No questions found.</p>
        )}
        
      </div>
    </>
  );
};

export default InterviewSummary;
