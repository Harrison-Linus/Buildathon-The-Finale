import json
import os
import urllib.request


BASE_URL = os.environ["OPENAI_BASE_URL"]
API_KEY = os.environ["OPENAI_API_KEY"]
MODEL = os.environ["BEDROCK_MODEL"]


def call_bedrock(prompt):
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    request = urllib.request.Request(
        f"{BASE_URL}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        },
        method="POST"
    )

    with urllib.request.urlopen(request, timeout=60) as response:
        result = json.loads(response.read().decode("utf-8"))

    return result["choices"][0]["message"]["content"]


def get_body(event):
    body = event.get("body")

    if not body:
        return event

    if event.get("isBase64Encoded"):
        import base64
        body = base64.b64decode(body).decode("utf-8")

    if isinstance(body, str):
        return json.loads(body)

    return body


def analyze_skills(employee):
    prompt = f"""
You are an AI-powered internal talent discovery assistant.

Analyze this employee.

Employee:
{json.dumps(employee, indent=2)}

Return valid JSON with exactly these fields:

explicit_skills
transferable_skills
strengths
potential_future_roles
skill_gaps
recommended_learning
career_roadmap

Keep the answer practical and concise.
"""

    return call_bedrock(prompt)


def match_role(employee, role):
    employee_skills = {
        skill.strip().lower()
        for skill in employee.get("skills", [])
    }

    required_skills = {
        skill.strip().lower()
        for skill in role.get("required_skills", [])
    }

    matching_skills = sorted(employee_skills.intersection(required_skills))
    missing_skills = sorted(required_skills - employee_skills)

    if required_skills:
        match_percentage = round(
            len(matching_skills) / len(required_skills) * 100
        )
    else:
        match_percentage = 0

    prompt = f"""
You are an internal talent matching assistant.

Employee:
{json.dumps(employee, indent=2)}

Target role:
{json.dumps(role, indent=2)}

Known matching skills:
{matching_skills}

Known skill gaps:
{missing_skills}

Explain the suitability of this employee for the role.

Return valid JSON with exactly these fields:

transferable_skills
explanation

Keep it concise.
"""

    try:
        ai_result = call_bedrock(prompt)

        try:
            cleaned = ai_result.strip()

            if cleaned.startswith("```"):
                cleaned = cleaned.replace("```json", "", 1)
                cleaned = cleaned.replace("```", "", 1).strip()

            ai_data = json.loads(cleaned)
        except Exception:
            ai_data = {
                "transferable_skills": [],
                "explanation": ai_result
            }

    except Exception as e:
        ai_data = {
            "transferable_skills": [],
            "explanation": f"AI explanation unavailable: {str(e)}"
        }

    return {
        "employee_id": employee.get("id"),
        "role_id": role.get("id"),
        "role_title": role.get("title"),
        "match_percentage": match_percentage,
        "matching_skills": matching_skills,
        "skill_gaps": missing_skills,
        "transferable_skills": ai_data.get(
            "transferable_skills", []
        ),
        "explanation": ai_data.get(
            "explanation", ""
        )
    }


def skill_gap(employee, role):
    employee_skills = {
        skill.strip().lower()
        for skill in employee.get("skills", [])
    }

    required_skills = [
        skill.strip()
        for skill in role.get("required_skills", [])
    ]

    missing_skills = [
        skill
        for skill in required_skills
        if skill.lower() not in employee_skills
    ]

    prompt = f"""
You are an internal career development assistant.

Employee:
{json.dumps(employee, indent=2)}

Target role:
{json.dumps(role, indent=2)}

Missing skills:
{missing_skills}

Create a practical learning plan.

Return valid JSON with exactly these fields:

priority_skills
recommended_courses
recommended_projects
timeline

Keep the answer concise and realistic.
"""

    ai_result = call_bedrock(prompt)

    return {
        "target_role": role.get("title"),
        "missing_skills": missing_skills,
        "ai_learning_plan": ai_result
    }


def career_roadmap(employee, role):
    prompt = f"""
You are an AI career development assistant.

Employee:
{json.dumps(employee, indent=2)}

Desired internal role:
{json.dumps(role, indent=2)}

Create a personalized career roadmap.

Return valid JSON with exactly these fields:

current_position
short_term_goals
mid_term_goals
long_term_goals
recommended_learning
recommended_projects
milestones

Keep it practical and concise.
"""

    return call_bedrock(prompt)


def career_chat(data):
    employee = data.get("employee", {})
    question = data.get("question", "")

    prompt = f"""
You are an internal AI career assistant.

Employee profile:
{json.dumps(employee, indent=2)}

Employee question:
{question}

Answer the employee's question using their profile.

Be practical, clear, and concise.
"""

    return call_bedrock(prompt)


def lambda_handler(event, context):

    try:
        body = get_body(event)

        # HTTP API route
        route = event.get("rawPath")

        # Direct Lambda test fallback
        if not route:
            route = body.get("route", "/analyze-skills")

        if route == "/analyze-skills":

            result = analyze_skills(body)

        elif route == "/match-role":

            employee = body.get("employee", {})
            role = body.get("role", {})

            result = match_role(employee, role)

        elif route == "/skill-gap":

            employee = body.get("employee", {})
            role = body.get("role", {})

            result = skill_gap(employee, role)

        elif route == "/career-roadmap":

            employee = body.get("employee", {})
            role = body.get("role", {})

            result = career_roadmap(employee, role)

        elif route == "/career-chat":

            result = career_chat(body)

        else:

            return {
                "statusCode": 404,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "success": False,
                    "error": f"Unknown route: {route}"
                })
            }

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "success": True,
                "data": result
            })
        }

    except Exception as e:

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "success": False,
                "error": str(e)
            })
        }