from flask import Flask
from flask import render_template
from flask import request
app = Flask(__name__)

@app.route("/")
def login(name=None):
    return render_template('test.html', name=name)

@app.route("/result.html", methods=['GET', 'POST'])
def home(name=None):
	if request.method == 'POST':
		return render_template('result.html', name=name)
	else:
		return "<p>Invalid Access Mr. Mathias</p>"

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
