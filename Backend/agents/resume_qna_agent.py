from agno.agent import Agent, RunResponse
from agno.models.google import Gemini
from agno.tools.duckduckgo import DuckDuckGoTools
from typing import Dict, Any
import json

class InteractiveQnAAgent:
    def __init__(self):
        self.agent = Agent(
            model=Gemini(id="gemini-2.0-flash-exp"),
            tools=[DuckDuckGoTools()],
            show_tool_calls=False,
            markdown=False
        )

    def answer_question(self, question: str, resume_text: str) -> Dict[str, Any]:
        """Answer a user's question about their resume."""
        try:
            prompt = f'''
            You are an Interactive Q&A Agent.
            Your task is to:
            1. Answer the user's question about their resume.
            2. Provide constructive feedback and suggestions.
            Your final output should be in JSON format with these fields:
            {{
                "answer": string containing your answer,
                "suggestions": string containing your suggestions
            }}
            Now answer the following question about the resume:
            Question: {question}
            Resume: {resume_text}
            '''
            run_response: RunResponse = self.agent.run(prompt)
            content = run_response.content.strip()
            # Clean and parse the response
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
