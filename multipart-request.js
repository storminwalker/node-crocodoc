
var fs = require("fs"),
	request = require("request");

var encodeFieldPart = function(boundary, name, value) {
    var result = [];
    result.push("--" + boundary);
    result.push("Content-Disposition: form-data; name=\"" + name + "\"");
    result.push("");
    result.push(value);
    result.push("");
    return result.join("\r\n");
}

var encodeFilePart = function(boundary, type, name, filename) {
    var result = [];
	result.push("--" + boundary);
    result.push("Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"");
    result.push("Content-Type: " + type);
    result.push("")
    result.push("");
    return result.join("\r\n");
}

var toBuffer = function(part) {
	return new Buffer(part, "utf-8");
}

var post = function(config, callback) {
	
	if(! config.url) throw new Error("You must supply a url");
	if(! config.file) throw new Error("You must supply a file to encode for a mulitpart post");
	
	var boundary = config.boundary || Date.now(); 
	var length = 0;
	var postData = [];
	var file = config.file;
	
	config.params = config.params || {};
	
	for(name in config.params) {
		postData.push(toBuffer(encodeFieldPart(boundary, name, config.params[name])));
	}
	
	postData.push(toBuffer(encodeFieldPart(boundary, "title", file.fileName)));
	postData.push(toBuffer(encodeFilePart(boundary, file.type || "application/octet-stream", file.name || "file", file.fileName)));
	
	postData.push(toBuffer("\r\n--" + boundary + "--"));
	
	postData.forEach(function(pd) {
		length += pd.length;
	});
	
	fs.stat(file.path, function(err, stats) {
		if(err) throw err;
		
		if(stats.isFile() === false) {
			throw new Error("File path must reference a file");
		}
		
		length += stats.size;
		
		if(config.debug === true) {
			console.log(file);
			console.log({ 
				url: config.url,
				headers : {
					'Content-Type': 'multipart/form-data; boundary=' + boundary,
					'Content-Length': length
				},
			});
			postData.forEach(function(b) {
				console.log(b.toString());
			});
		}
		
		var req = request.post({ 
			url: config.url,
			headers : {
				'Content-Type': 'multipart/form-data; boundary=' + boundary,
				'Content-Length': length
			},
		}, function(err, res, body) {
			callback(err, JSON.parse(body));
		});
		
		var i = 0, len = postData.length;
		
		for(i; i < (len - 1); i++) {
			req.write(postData[i]);
		}
		
		var fileReader = fs.createReadStream(file.path);
		fileReader.on("data", function(data){
			req.write(data);
		});
		
		fileReader.on("end", function(){
			req.write(postData[(len - 1)]);
			req.end();
		});
	});
}
/*
post({
	url: "https://crocodoc.com/api/v1/document/upload",
	//debug: true,
	file: {
		path: "./examples/test/Invoice1.pdf",
		type: "application/octet-stream",
		name: "file",
		fileName: "Invoice1.pdf"
	},
	params: {
		token: "dtSHMcKLoQGqh74rWjvF"//,
		//private: true
	}
}, function(err, doc) {
	console.log(doc);
});
*/
module.exports.post = post;

