from dotenv import load_dotenv
load_dotenv()
from groq import Groq

for m in Groq().models.list().data:
    print(m.id)
    