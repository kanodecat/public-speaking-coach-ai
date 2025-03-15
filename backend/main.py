from google import genai

client = genai.Client()

myfile = client.files.upload(file='test.mp3')

response = client.models.generate_content(
  model='gemini-2.0-flash',
  contents=['give a score for public speaking of tone, speaking speed, checks for filler words', myfile]
)

print(response.text)
