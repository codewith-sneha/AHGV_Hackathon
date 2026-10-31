import json, urllib.request, urllib.error

B = "http://127.0.0.1:8000"

def post(path, body):
    req = urllib.request.Request(B + path, json.dumps(body).encode(), {"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.load(r)
    except urllib.error.HTTPError as e:
        return e.code, json.load(e)

s, quiz = post("/quiz/final", {"video_id": "lecture1.mp4", "pause_time": 720,
                               "allowed_resources": ["notes.pdf"], "course_id": None, "num_questions": 4})
print("final:", s, quiz.get("counts"))
s, fb = post("/quiz/feedback", {"quiz_token": quiz["quiz_token"],
                                "answers": [0] * len(quiz["questions"]), "ai_feedback": True})
print("feedback:", s, fb if s != 200 else (fb["score"], fb["total"], fb["summary"]))