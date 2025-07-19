from pathlib import Path
from agno.agent import Agent, RunResponse
from agno.media import File
from agno.models.google import Gemini
from agno.tools.duckduckgo import DuckDuckGoTools
from typing import Dict, Any
import json

class ResumeFeedbackAgent:
    def __init__(self):
        self.agent = Agent(
            model=Gemini(id="gemini-2.0-flash-exp"),
            tools=[DuckDuckGoTools()],
            show_tool_calls=False,
            markdown=False
        )

    def evaluate_resume(self, file_path: str) -> Dict[str, Any]:
        """Evaluate a user's resume PDF and provide feedback along with an ATS score."""
        try:
            run_response: RunResponse = self.agent.run(
                '''
                You are a Resume Feedback Agent.
                Your task is to:
                1. Evaluate the resume on a scale of 1 to 10 based on structure, clarity, relevance, and impact.
                2. Provide constructive feedback on what was good and what could be improved.
                3. Decide whether the user should update the resume (updateStatus = true) or if it is good to go (updateStatus = false).
                Your final output should be in JSON format with these fields:
                {
                    "score": integer from 1 to 10,
                    "feedback": string containing your feedback,
                    "updateStatus": boolean,
                }
                ''',
                files=[File(filepath=Path(file_path))],
            )

            # Clean and parse the response
            content = run_response.content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            return json.loads(content)
        except json.JSONDecodeError:
            return {
                "error": "Failed to parse agent response",
                "raw_response": run_response.content
            }
        except Exception as e:
            return {"error": str(e)}
