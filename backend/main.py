from flask import Flask, jsonify
from google.genai import types
from google import genai
from dotenv import load_dotenv
from flask_cors import CORS
import os
import moviepy.editor as mp

load_dotenv()

api_key = os.getenv('API_KEY')
if not api_key:
    raise ValueError("API_KEY is missing in the .env file")

client = genai.Client(api_key=api_key)

app = Flask(__name__)

CORS(app)

@app.route("/results", methods=["GET"])
def home():
    with open('test.mp3', 'rb') as f: # fix this I need to use webm
        clip = mp.VideoFileClip(f)
        image_bytes = clip.read()

    response = client.models.generate_content(
      model='gemini-2.0-flash',
      contents=[
        '''The audio file should be evaluated for public speaking based on the following criteria:
        Tone: Is the tone engaging and varied, or is it monotonous?
        Speaking Speed: Was the speaking speed appropriate or too fast/slow?
        Filler Words: How many filler words (like "um", "uh", "you know", etc.) are present?
        Volume: Was the speaker loud enough?
        The result should be provided in the following JSON format:

        {
          "score": 86,
          "metrics": {
            "filler_words": {
              "count": 2,
              "status": "pass",
              "message": "You used less than 3 filler words"
            },
            "tone": {
              "status": "fail",
              "message": "Your tone was too monotone"
            },
            "speed": {
              "status": "fail",
              "message": "You spoke too fast",
              "words_per_minute": 180
            },
            "volume": {
              "status": "pass",
              "message": "You spoke loud enough"
            }
          }
        }

        Score: A rating out of 100 based on the overall evaluation.
        Metrics: A set of categories with:
            Filler Words: Count and assessment.
            Tone: Evaluation of the tone and any relevant messages.
            Speed: Assessment of speaking speed (including words per minute).
            Volume: Feedback on the speaker's volume.''',
          
        genai.types.Part.from_bytes(
          data=image_bytes,
          mime_type='audio/mp3',
        )
      ]
    )

    sigma = {
      "score": 86,
      "metrics": {
        "filler_words": {
          "count": 2,
          "status": "pass",
          "message": "You got less than 3 filler words"
        },
        "tone": {
          "status": "fail",
          "message": "Your tone was too monotone"
        },
        "speed": {
          "status": "fail",
          "message": "You talked too fast",
          "words_per_minute": 180
        },
        "volume": {
          "status": "pass",
          "message": "You talked loud enough"
        }
      }
    }

    print(response)

    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

