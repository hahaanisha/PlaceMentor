/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InternalNavbar from "./InternalNavbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";

const CoverLetterPage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jd, setJd] = useState(""); // 🔹 state for Job Description

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setCoverLetter(null);
  };

  const generateCoverLetter = async () => {
    if (!resumeFile || !jd.trim()) {
      alert("Please upload your resume and enter the job description.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    // ✅ Use the correct field names as expected by your backend
    formData.append("resume", resumeFile);
    formData.append("jd", jd);

    try {
      const res = await axios.post(
        "https://placementor-backend.onrender.com/generate_cover_letter",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ Expecting cover_letter key in response
      if (res.data && res.data.cover_letter) {
        setCoverLetter(res.data.cover_letter);
      } else {
        console.error("Unexpected response:", res.data);
        alert("Something went wrong while generating the cover letter.");
      }
    } catch (err) {
      console.error("Cover letter generation failed:", err);
      alert("Failed to generate cover letter. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InternalNavbar showQuitButton={false} showHomeButton={true} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 pt-10 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Upload + JD Section */}
          <Card className="shadow-lg rounded-xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                📄 Upload Your Resume (PDF)
              </h2>
              <input type="file" accept=".pdf" onChange={handleFileChange} />

              <h3 className="text-md font-semibold text-gray-800 mt-4">
                📝 Paste Job Description
              </h3>
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={5}
                placeholder="Paste the job description here..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />

              <Button
                onClick={generateCoverLetter}
                disabled={loading || !resumeFile || !jd.trim()}
                className="mt-2 cursor-pointer"
              >
                {loading ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Cover Letter */}
          {coverLetter && (
            <Card className="shadow-lg rounded-xl bg-white">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-blue-800">
                  ✍️ Your Generated Cover Letter
                </h2>
                <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {coverLetter}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default CoverLetterPage;
