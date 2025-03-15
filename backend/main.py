from flask import Flask
from google import genai

app = Flask(__name__)


"""
client = genai.Client()

myfile = client.files.upload(file='test.mp3') # need to do

response = client.models.generate_content(
  model='gemini-2.0-flash',
  contents=['give a score for public speaking of tone, speaking speed, checks for filler words', myfile]
)

print(response.text)
"""


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
app.run(threaded=True)
