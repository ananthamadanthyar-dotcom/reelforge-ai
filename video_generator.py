import os
import sys
import io

# Force UTF-8 encoding for Windows terminal outputs
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from gtts import gTTS
from moviepy import AudioFileClip, ColorClip, TextClip, CompositeVideoClip

def generate_faceless_short(script_text: str, output_filename: str = "output_reel.mp4"):
    print("Step 1: Generating AI Voiceover...")
    tts = gTTS(text=script_text, lang='en', slow=False)
    audio_path = "temp_voiceover.mp3"
    tts.save(audio_path)
    
    audio_clip = AudioFileClip(audio_path)
    duration = audio_clip.duration
    
    print(f"Step 2: Rendering Background & Captions (Duration: {duration:.2f}s)...")
    
    bg_clip = ColorClip(size=(1080, 1920), color=[3, 7, 18], duration=duration)
    
    txt_clip = TextClip(
        text=script_text, 
        font_size=50, 
        color='white', 
        size=(900, None),
        method='caption'
    ).with_duration(duration).with_position('center')
    
    video = CompositeVideoClip([bg_clip, txt_clip])
    video = video.with_audio(audio_clip)
    
    print("Step 3: Exporting final video file...")
    video.write_videofile(
        output_filename, 
        fps=24, 
        codec='libx264', 
        audio_codec='aac',
        preset='medium'
    )
    
    audio_clip.close()
    os.remove(audio_path)
    print(f"Successfully generated: {output_filename}")

if __name__ == "__main__":
    # Accept script text from command line arguments if provided
    script = sys.argv[1] if len(sys.argv) > 1 else "The last light crystal on Earth is fading."
    filename = sys.argv[2] if len(sys.argv) > 2 else "reel_test.mp4"
    generate_faceless_short(script, filename)