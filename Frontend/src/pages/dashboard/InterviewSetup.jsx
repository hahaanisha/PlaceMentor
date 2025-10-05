"use client";
import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Code2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function InterviewSetup() {
  const [company, setCompany] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [round, setRound] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const resumeSummary = localStorage.getItem("ResumeSummary");

  const handleStartInterview = async () => {
    const finalCompany = company === "other" ? customCompany : company;
    const finalRole = role === "other" ? customRole : role;

    if (!finalCompany || !finalRole || !round) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "https://placementor-backend.onrender.com/generate-interview-questions",
        {
          resume_summary: resumeSummary,
          company: finalCompany,
          role: finalRole,
          round,
        }
      );
      console.log("Interview started:", response.data.interview_plan);
      localStorage.setItem("QuestionCount", 1);
      localStorage.setItem(
        "InterviewPlan",
        JSON.stringify(response.data.interview_plan)
      );
      navigate("/start-interview");
    } catch (error) {
      console.error("Error starting interview:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Interview Setup
          </h2>
        </div>
        <Card className="rounded-2xl shadow-lg border-0">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Setup Your Interview
              </h3>
              <p className="text-gray-600 text-sm">
                Configure your interview preferences to get personalized
                questions
              </p>
            </div>
            <div className="space-y-6">
              {/* Company Select */}
              <div className="space-y-2">
                <Label
                  htmlFor="company"
                  className="text-sm font-medium text-gray-700"
                >
                  Target Company <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setCompany(value)}>
                  <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 outline-none transition-all">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg rounded-lg">
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="Microsoft">Microsoft</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {company === "other" && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom company"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                  />
                )}
              </div>

              {/* Role Select */}
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  Target Role <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setRole(value)}>
                  <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 outline-none transition-all">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg rounded-lg">
                    <SelectItem value="SDE">SDE</SelectItem>
                    <SelectItem value="Intern">Intern</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {role === "other" && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom role"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                  />
                )}
              </div>

              {/* Interview Type Toggle */}
              <div className="space-y-3">
                <Label
                  htmlFor="interviewType"
                  className="text-sm font-medium text-gray-700"
                >
                  Interview Type <span className="text-red-500">*</span>
                </Label>
                <ToggleGroup
                  type="single"
                  className="grid grid-cols-2 gap-4 mt-3"
                  onValueChange={(value) => setRound(value)}
                >
                  <ToggleGroupItem
                    value="technical"
                    className={`flex flex-col items-center justify-center border-2 rounded-xl px-4 py-6 h-[120px] transition-all ${
                      round === "technical"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <Code2 className="h-6 w-6 mb-2" />
                    <div className="font-medium">Technical</div>
                    <div className="text-sm text-gray-500 text-center">
                      Coding & Skills
                    </div>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="hr"
                    className={`flex flex-col items-center justify-center border-2 rounded-xl px-4 py-6 h-[120px] transition-all ${
                      round === "hr"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <User className="h-6 w-6 mb-2" />
                    <div className="font-medium">HR</div>
                    <div className="text-sm text-gray-500 text-center">
                      Behavioral Qs
                    </div>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Start Button */}
              <Button
                className={`w-full h-12 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
                  !company ||
                  (company === "other" && !customCompany) ||
                  !role ||
                  (role === "other" && !customRole) ||
                  !round ||
                  loading
                    ? "opacity-50 cursor-not-allowed transform-none"
                    : ""
                }`}
                disabled={
                  !company ||
                  (company === "other" && !customCompany) ||
                  !role ||
                  (role === "other" && !customRole) ||
                  !round ||
                  loading
                }
                onClick={handleStartInterview}
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Starting...
                  </span>
                ) : (
                  "Start Interview"
                )}
              </Button>
              <p className="text-xs text-center text-gray-500">
                * Required fields
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
