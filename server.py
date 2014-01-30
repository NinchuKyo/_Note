from flask import Flask
app = Flask(__name__)

@app.route("/")
def login():
    return "Welcome to _Note</br>Please login with your Dropbox account."

@app.route("/home")
def home():
    return "You have logged in successfully.</br>Here's a list of your notes."

if __name__ == "__main__":
    app.run()
