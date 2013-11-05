var fs = require("fs");

module.exports.router = function (req, res) {
	if(req.url === "/") {
		fs.readFile("public/index.html", { "encoding": "utf8"}, function(err, data) {
			if(err) {
				res.writeHead(500);
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