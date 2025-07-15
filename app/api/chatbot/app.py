import os
from dotenv import load_dotenv


base_dir = os.path.dirname(__file__)
dotenv_path = os.path.join(base_dir, ".env")
load_dotenv(dotenv_path)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings


CHROMA_PATH = "chroma"
MODEL_CANDIDATES = [
    "gemini-1.5-flash",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
]
BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

class Message(BaseModel):
    role: str
    content: str

class GenerateRequest(BaseModel):
    messages: List[Message]

class GenerateResponse(BaseModel):
    message: str
    sources: List[Optional[str]]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

def get_embedding_function():
    return GoogleGenerativeAIEmbeddings(model="models/embedding-001")

def call_gemini(model_name: str, prompt: str, api_key: str) -> str:
    """Attempt a single-model call with retries; raise HTTPException on failure."""
    url = f"{BASE_URL}/{model_name}:generateContent?key={api_key}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    session = requests.Session()
    retries = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[502, 503, 504],
        allowed_methods=["POST"],
    )
    session.mount("https://", HTTPAdapter(max_retries=retries))

    try:
        resp = session.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30,
        )
    except (requests.exceptions.RetryError, requests.exceptions.ReadTimeout):
        raise HTTPException(503, f"Model {model_name} busy or timed out.")
    except Exception as e:
        raise HTTPException(500, f"Unexpected error calling model {model_name}: {e}")

    if not resp.ok:
        raise HTTPException(503, f"Model {model_name} error {resp.status_code}: {resp.text}")

    data = resp.json()
    return "".join(
        part.get("text", "")
        for cand in data.get("candidates", [])
        for part in cand.get("content", {}).get("parts", [])
    )


@app.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    user_msgs = [m.content for m in req.messages if m.role == "user"]
    if not user_msgs:
        raise HTTPException(400, "No user message provided.")
    question = user_msgs[-1].strip()

    #greeting
    if question.lower() in {"hello", "hi", "hey"}:
        return GenerateResponse(
            message="Hello there! How can I assist you with your travel plans today?",
            sources=[]
        )

    #rag
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=get_embedding_function(),
    )
    results = db.similarity_search_with_score(question, k=5)
    context = "\n\n---\n\n".join(doc.page_content for doc, _ in results)

    #prompt
    prompt = PROMPT_TEMPLATE.format(context=context, question=question)

    #try all models
    api_key = os.getenv("GENAI_API_KEY")
    if not api_key:
        raise HTTPException(500, "GENAI_API_KEY not set in environment")

    last_exc = None
    for model in MODEL_CANDIDATES:
        try:
            answer = call_gemini(model, prompt, api_key)
            break
        except HTTPException as e:
            last_exc = e
    else:
        raise last_exc

    #generate answer
    sources = [doc.metadata.get("id") for doc, _ in results]
    return GenerateResponse(message=answer, sources=sources)