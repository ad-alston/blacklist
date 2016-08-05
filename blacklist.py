from flask import Flask
app = Flask(__name__)

@app.route("/")
	return "AYY LMAO GET HAKT"

if __name__ == "__main__":
	app.run()