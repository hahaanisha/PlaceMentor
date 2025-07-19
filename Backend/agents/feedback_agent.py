from agno.agent import Agent, RunResponse
from agno.models.google import Gemini
from agno.tools.duckduckgo import DuckDuckGoTools
from typing import Dict, Any
import json

class FeedbackAgent:
    def __init__(self):
        self.agent = Agent(
            model=Gemini(id="gemini-2.0-flash-exp"),
            tools=[DuckDuckGoTools()],
            show_tool_calls=False,
            markdown=False
        )

    def evaluate_answer(self, question: str, user_answer: str, resume_summary: str) -> Dict[str, Any]:
        """Evaluate a user's interview answer and provide feedback."""
        try:
            prompt = f'''
            You are an Interview Preparation Feedback Agent.
            You will be given a user's response to a respective interview question and the user's resume summary.
            Your task is to:
            1. Evaluate the answer on a scale of 1 to 10 based on structure, clarity, relevance, and impact.
            2. Provide constructive feedback on what was good, what could be improved, and how to say it better (keep it short and precise).
            3. Correct the answer in a learning format — guide the user by saying: "You should say this and that so it will sound like this..." and then provide the improved version.
            4. Decide whether the user should repeat this question again for practice (repeatStatus = true) or move forward (repeatStatus = false).

            Your final output should be in JSON format with these fields:
            {{
                "score": integer from 1 to 10,
                "feedback": string containing your feedback(make it suggesstive giving suggessions like do this do that you missed here but in short and so that user can read easily),
                "correctedAnswer": just the string with improved version of the answer wrt the user's resume no other stuff,
                "repeatStatus": boolean
            }}

            Ensure to take the data for correctedAnswer section using resume summary , dont include general stuffs like say title and description instead include the real data from the provided resume summary.
            
            Now evaluate the following:
            Question: {question}
            User Answer: {user_answer}
            Resume Summary: {resume_summary}
'''

            run_response: RunResponse = self.agent.run(prompt)
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
