var fs = require("fs");

module.exports.route = function (req, res) {
	if(req.url === "/") {
		fs.readFile("public/index.html", { "encoding": "utf8"}, function(err, data) {
			if(err) {
				throw err;
			} else {
				res.write(data);
				res.end();
			}
		});
	} else {
		fs.readFile("public" + req.url, { "encoding": "utf8"}, function(err, data) {
			if(err) {
				res.writeHead(404);
			} else {
				res.write(data);
			}
			res.end();
		});
	}
};