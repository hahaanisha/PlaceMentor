/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InternalNavbar from "./InternalNavbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";

const ATSPage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [qnaResult, setQnaResult] = useState(null);
  const [resumeSummary, setResumeSummary] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setFeedback(null);
    setQnaResult(null);
  };

  const uploadResume = async () => {
    if (!resumeFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("resume_pdf", resumeFile);

    try {
      const res = await axios.post(
        "https://placementor-backend.onrender.com/evaluate-resume",
        formData
      );
      setFeedback(res.data);
      if (res.data.resume_summary) {
        setResumeSummary(res.data.resume_summary);
        localStorage.setItem("resume_summary", res.data.resume_summary);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question) return;
    const summary = resumeSummary || localStorage.getItem("ResumeSummary");
    if (!summary) {
      alert("Resume summary not found. Please upload your resume.");
      return;
    }
    try {
      const res = await axios.post(
        "https://placementor-backend.onrender.com/answer-resumeQuestion",
        {
          question,
          resume_text: summary,
        }
      );
      setQnaResult(res.data);
    } catch (err) {
      console.error("QnA failed:", err);
    }
  };

 return (
   <>
     <InternalNavbar showQuitButton={false} showHomeButton={true} />
     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 pt-10 px-4">
       <div className="max-w-7xl mx-auto space-y-8">
         {/* Upload Section */}
         <Card className="shadow-lg rounded-xl">
           <CardContent className="p-6 space-y-4">
             <h2 className="text-xl font-bold text-gray-800">
               📄 Upload Your Resume (PDF)
             </h2>
             <input type="file" accept=".pdf" onChange={handleFileChange} />
             <Button
               onClick={uploadResume}
               disabled={loading || !resumeFile}
               className="mt-2 cursor-pointer"
             >
               {loading ? "Analyzing..." : "Get Feedback"}
             </Button>
           </CardContent>
         </Card>

         {/* Feedback + Ask AI Side-by-side */}
         {feedback && (
           <div className="flex flex-col lg:flex-row gap-6">
             {/* Resume Feedback */}
             <Card className="shadow-lg rounded-xl flex-1 bg-white">
               <CardContent className="p-6 space-y-4">
                 <h2 className="text-2xl font-semibold text-blue-800">
                   🔍 Resume Feedback
                 </h2>
                 <p className="text-sm text-gray-700">
                   <strong>ATS Score:</strong> {feedback.score} / 10
                 </p>
                 <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                     {feedback.feedback}
                   </ReactMarkdown>
                 </div>
                 <p className="text-sm text-gray-700">
                   <strong>Needs Update?</strong>{" "}
                   {feedback.updateStatus ? "Yes" : "No"}
                 </p>
               </CardContent>
             </Card>

             {/* Ask AI */}
             <Card className="shadow-lg rounded-xl flex-1 bg-white">
               <CardContent className="p-6 space-y-4">
                 <h2 className="text-xl font-semibold text-gray-800">
                   🤖 Ask AI About Your Resume
                 </h2>
                 <textarea
                   className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                   rows={4}
                   placeholder="Ask something about your resume..."
                   value={question}
                   onChange={(e) => setQuestion(e.target.value)}
                 />
                 <Button onClick={askQuestion} className="mt-2 cursor-pointer">
                   Ask AI
                 </Button>
                 {qnaResult && (
                   <div className="bg-blue-50 p-4 rounded-lg space-y-2 mt-4 text-sm">
                     <p>
                       <strong>Answer:</strong> {qnaResult.answer}
                     </p>
                     <p>
                       <strong>Suggestions:</strong> {qnaResult.suggestions}
                     </p>
                   </div>
                 )}
               </CardContent>
             </Card>
           </div>
         )}
       </div>
     </div>
   </>
 );

};

export default ATSPage;
