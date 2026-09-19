import os
from dotenv import load_dotenv
from openai import OpenAI

# Load variables from .env
load_dotenv()

# Create Bedrock-Mantle client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv(
        "OPENAI_BASE_URL",
        "https://bedrock-mantle.us-east-1.api.aws/openai/v1"
    )
)

MODEL = os.getenv("BEDROCK_MODEL", "google.gemma-4-e2b")


def analyze_employee(employee):
    prompt = f"""
You are an AI-powered internal talent discovery and career assistant.

Analyze the following employee.

Employee Name:
{employee["name"]}

Current Role:
{employee["current_role"]}

Experience:
{employee["experience"]}

Skills:
{", ".join(employee["skills"])}

Projects:
{", ".join(employee["projects"])}

Certifications:
{", ".join(employee["certifications"])}

Identify:

1. Explicit Skills
2. Transferable Skills
3. Strengths
4. Potential Future Roles
5. Skill Gaps
6. Recommended Learning
7. Career Roadmap

Return the answer in clear JSON format.

Keep the response practical and concise.
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content


if __name__ == "__main__":

    employee = {
        "name": "Keerthivasan M",
        "current_role": "Software Developer",
        "experience": "2 years",
        "skills": [
            "Python",
            "SQL",
            "React",
            "AWS"
        ],
        "projects": [
            "Serverless Order Processing System",
            "Resume Screening System"
        ],
        "certifications": [
            "AWS Cloud Practitioner"
        ]
    }

    print("\nSending employee profile to Bedrock...\n")

    try:
        result = analyze_employee(employee)

        print("===== AI CAREER ANALYSIS =====")
        print(result)

    except Exception as e:
        print("ERROR:")
        print(type(e).__name__, str(e))
        