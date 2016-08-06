# Blacklist.py
#
# Sets routes, runs the instance on a werkzeug server, and all of that 
# good stuff.


from flask import Flask, request, jsonify, render_template
from flask_restful import Resource, Api
import redis, json

r = redis.StrictRedis(host='localhost', port=6379, db=0)

app = Flask(__name__)
api = Api(app)


@app.route("/")
def index():
	return render_template("index.html")


@api.resource('/upload')
class Upload(Resource):

	def rs_index(self, content, content_iv, content_hash, keyword):
		doc = {'content': content, 'content-iv': content_iv, 'content-hash': content_hash }
		r.set(keyword, json.dumps(doc))

	def post(self):
		content 	 = request.form.get('content')
		content_iv   = request.form.get('content-iv')
		content_hash = request.form.get('content-hash')
		keyword 	 = request.form.get('keyword')

		if not content or not content_iv or not content_hash or not keyword:
			return jsonify(success=False)
		self.rs_index(content, content_iv, content_hash, keyword)
		return jsonify(success=True)


@api.resource('/search')
class Search(Resource):

	def rs_retrieve(self, keyword):
		print r.get(keyword)
		return r.get(keyword)

	def rs_indexed(self, keyword):
		if r.get(keyword):
			return True
		return False

	def post(self):
		keyword 	 = request.form.get('keyword')
		if not keyword or not self.rs_indexed(keyword):
			return jsonify(success=False, content=None, content_iv = None, content_hash = None)
		else:
			raw = self.rs_retrieve(keyword)
			doc = json.loads(raw)
			return jsonify(success=True, content=doc["content"], content_iv=doc["content-iv"], content_hash=doc["content-hash"])

if __name__ == '__main__':
    app.run(debug=True)

