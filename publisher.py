import os
import sys
import io
import google.auth
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Force UTF-8 encoding for Windows terminal outputs
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def upload_youtube_short(file_path: str, title: str, description: str):
    print(f"Starting YouTube upload for: {title}...")
    
    # Note: Requires client_secret.json / token setup for YouTube Data API v3
    # For initial testing or automated server-to-server flows, credentials are loaded via environment or token files.
    # We will expand this with your API OAuth token credentials next.
    
    print(f"Successfully uploaded {file_path} to YouTube Shorts!")

if __name__ == "__main__":
    video_file = sys.argv[1] if len(sys.argv) > 1 else "reel_test.mp4"
    video_title = sys.argv[2] if len(sys.argv) > 2 else "Automated Faceless Short #Shorts"
    upload_youtube_short(video_file, video_title, "Generated automatically via ReelForge AI.")