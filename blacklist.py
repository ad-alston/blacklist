# Blacklist.py
#
# Sets routes, runs the instance on a werkzeug server, and all of that 
# good stuff.

from flask import Flask

from flask import render_template
from flask import request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
	return render_template("index.html")

# Endpoint to be used to add new posts
@app.route("/new_post", methods=["POST"])
def new_post():
	params = { x: request.form[x] for x in request.form }
	print params.keys()

	if "keyword" in params and "content" in params and "content-hash" in params:
		print params["keyword"]
		print params["content-hash"]
		# TODO: index this new post
		return jsonify({"status": "success"})

	return jsonify({"status": "Invalid request."})

if __name__ == "__main__":
	app.run()