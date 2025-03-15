from google import genai
from flask import Flask

'''client = genai.Client()

myfile = client.files.upload(file='test.mp3')

response = client.models.generate_content(
  model='gemini-2.0-flash',
  contents=['give a score for public speaking of tone, speaking speed, checks for filler words', myfile]
)

print(response.text)
'''

app = Flask(__name__)

@app.route("/")
def home():
    return "<p>Hello World!</p>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)