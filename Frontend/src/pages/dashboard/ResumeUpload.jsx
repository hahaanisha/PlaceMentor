"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const response = await axios.post(
        "https://placementor-backend.onrender.com/parse-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Resume uploaded successfully:", response.data);
      // Store the response in localStorage
      localStorage.setItem("ResumeSummary", JSON.stringify(response.data));
      navigate('/interview-setup');
    } catch (error) {
      console.error("Error uploading resume:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Card className="rounded-2xl shadow-lg border-0">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Upload Your Resume
              </h3>
              <p className="text-gray-600 text-sm">
                Upload a PDF resume to extract summary
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="resume"
                  className="text-sm font-medium text-gray-700"
                >
                  Resume (PDF only)
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="resume-upload"
                    className="flex flex-col items-center justify-center w-full"
                  >
                    <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium text-blue-600 hover:text-blue-500">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF up to 10MB
                      </p>
                    </div>
                    <Input
                      id="resume-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Selected file:{" "}
                    <span className="font-medium text-gray-800">
                      {file.name}
                    </span>
                  </p>
                )}
              </div>
              <Button
                className={`w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
                  !file || loading
                    ? "opacity-50 cursor-not-allowed transform-none"
                    : ""
                }`}
                disabled={!file || loading}
                onClick={handleUpload}
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Upload Resume"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
