import os
from groq import Groq
from app.config import GROQ_API_KEY
from moviepy import VideoFileClip

groq_client = Groq(api_key=GROQ_API_KEY)

def transcribe_audio_with_timestamps(file_path: str):
    """
    Extracts audio from video to bypass Groq's 25MB limit, 
    then sends the lightweight audio to Whisper.
    """
    upload_path = file_path
    
    # If the file is a video, strip the audio into a temporary MP3
    if file_path.lower().endswith((".mp4", ".mov", ".avi", ".mkv")):
        print("[Ingestion] Stripping audio from video to reduce size...")
        upload_path = file_path.rsplit(".", 1)[0] + ".mp3"
        video = VideoFileClip(file_path)
        video.audio.write_audiofile(upload_path, logger=None)
        video.close()

    try:
        # Send the lightweight audio file to Groq
        with open(upload_path, "rb") as file:
            transcription = groq_client.audio.transcriptions.create(
                file=(upload_path, file.read()),
                model="whisper-large-v3",
                response_format="verbose_json",
                timestamp_granularities=["segment"]
            )
    finally:
        # Clean up the temporary MP3 if we created one
        if upload_path != file_path and os.path.exists(upload_path):
            os.remove(upload_path)

    # Format the data for Qdrant
    chunks = []
    for segment in transcription.segments:
        chunks.append({
            "text": segment["text"].strip(),
            "start_sec": float(segment["start"]),
            "end_sec": float(segment["end"]),
            "source_type": "video"
        })
    return chunks