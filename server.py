# Blacklist.py
#
# Sets routes, runs the instance on a werkzeug server, and all of that 
# good stuff.


from flask import Flask, request, jsonify, render_template
from flask_restful import Resource, Api
import redis, json

redis_conn = redis.StrictRedis(host='localhost', port=6379, db=0)

app = Flask(__name__)
api = Api(app)


@app.route("/")
def index():
	return render_template("index.html")


@api.resource('/upload')
class Upload(Resource):
	def rs_index(self, content, content_iv, content_hash, keyword):
		doc = {'content': content, 'content-iv': content_iv, 'content-hash': content_hash }
		redis_conn.rpush(keyword, json.dumps(doc))

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

	def post(self):
		keyword = request.form.get('keyword')

		results = redis_conn.lrange(keyword, 0, -1)
		print len(results)

		if not keyword or not results or len(results) == 0:
			return jsonify(success=False, content=None, content_iv = None, content_hash = None)
		else:
			return jsonify(success=True, results=results[0:10])

if __name__ == '__main__':
    app.run(debug=True)

