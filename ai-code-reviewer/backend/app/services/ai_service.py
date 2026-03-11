import json
from typing import Any
import httpx
from openai import AsyncOpenAI
from app.core.config import get_settings

SYSTEM_PROMPT = """You are an expert code reviewer. Analyze the given code and return a JSON object with this exact structure (no markdown, no code block wrapper, just valid JSON):
{
  "score": <number 0-100, overall code quality>,
  "bugs": [{"line": <number or null>, "message": "<description>"}],
  "security": [{"line": <number or null>, "message": "<description>"}],
  "performance": [{"line": <number or null>, "message": "<description>"}],
  "readability": [{"line": <number or null>, "message": "<description>"}],
  "summary": "<2-3 sentence overall summary>"
}
Rules: Be concise. If no issues in a category, use []. "line" can be null. Return only the JSON object."""


def _parse_ai_response(text: str) -> dict[str, Any]:
    text = (text or "{}").strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"score": 70, "bugs": [], "security": [], "performance": [], "readability": [{"line": None, "message": "AI returned non-JSON."}], "summary": "Review completed but response format was invalid."}


async def _review_via_ollama(code: str, language: str) -> dict[str, Any]:
    settings = get_settings()
    user_content = f"Language: {language}\n\nCode:\n```{language}\n{code}\n```"
    url = f"{settings.ollama_base_url.rstrip('/')}/api/chat"
    payload = {"model": settings.ollama_model, "messages": [{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_content}], "stream": False, "format": "json", "options": {"temperature": 0.3}}
    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
    text = (resp.json().get("message") or {}).get("content") or "{}"
    return _parse_ai_response(text)


async def _review_via_openai(code: str, language: str) -> dict[str, Any]:
    settings = get_settings()
    if not settings.openai_api_key:
        return _mock_review(code, language)
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    user_content = f"Language: {language}\n\nCode:\n```{language}\n{code}\n```"
    response = await client.chat.completions.create(model=settings.openai_model, messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_content}], temperature=0.3)
    text = response.choices[0].message.content or "{}"
    return _parse_ai_response(text)


def _mock_review(code: str, language: str, note: str = "") -> dict[str, Any]:
    issues = []
    if "password" in code.lower() and "=" in code:
        issues.append({"line": None, "message": "Possible hardcoded credential; use env vars or secrets."})
    if "eval(" in code:
        issues.append({"line": None, "message": "eval() is dangerous; avoid in production."})
    if language == "python" and "except:" in code:
        issues.append({"line": None, "message": "Use 'except Exception:' or specific exception types."})
    summary = note or "Mock review (use Ollama or set OPENAI_API_KEY for real AI review). "
    summary += "Some issues were detected." if issues else "Code looks okay."
    return {"score": max(50, min(85, 80 - len(issues) * 10)), "bugs": issues[:2], "security": [x for x in issues if "credential" in x.get("message", "") or "eval" in x.get("message", "")], "performance": [], "readability": [], "summary": summary}


async def review_code(code: str, language: str) -> dict[str, Any]:
    settings = get_settings()
    if settings.ai_provider.strip().lower() == "ollama":
        try:
            return await _review_via_ollama(code, language)
        except (httpx.ConnectError, httpx.ConnectTimeout):
            return _mock_review(code, language, note=f"Ollama unreachable ({settings.ollama_base_url}). Run: ollama pull {settings.ollama_model}")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return _mock_review(code, language, note=f"Model '{settings.ollama_model}' not found. Run: ollama pull {settings.ollama_model}")
            raise
    return await _review_via_openai(code, language)
