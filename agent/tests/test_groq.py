import os
from dotenv import load_dotenv
load_dotenv()
from groq import Groq

model = os.getenv("GROQ_MODEL") or "openai/gpt-oss-120b"
print("GROQ_MODEL env =", repr(os.getenv("GROQ_MODEL")))
print("using model    =", model)

r = Groq().chat.completions.create(
    model=model,
    messages=[{"role": "user", "content": "say hi in one short sentence"}],
    max_tokens=500,
    reasoning_effort="low",
)
c = r.choices[0]
print("finish_reason:", c.finish_reason)
print("content:", repr(c.message.content))