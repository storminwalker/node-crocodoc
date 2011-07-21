
var request = require("request"),
	multipart = require("./multipart-request"),
	fs = require("fs"),
	qs = require("querystring"),
	path = require("path");

var apiUrl = "https://crocodoc.com/api/v1"; // Crocodoc's API's base URL

var defaultOptions = {
	token: "dtSHMcKLoQGqh74rWjvF",
	async: false,
	private: false,
	editable: false,
	downloadable: true
};

var merge = function(object, config) {
	var property;
	
	if (object) {
		for (property in config) {
			if (object[property] === undefined) {
				object[property] = config[property];
			}
		}
	}
	
	return object;
};

var buildUrl = function(path, options) { 
	var query = "";
	if(options) {
		query = "?" + qs.stringify(options) 
	}
	return apiUrl + path + query;
}

var get = function(path, options, callback) {
	console.log(path);
	console.log(buildUrl(path, options));
	console.log(options);
	
	request.get({
		uri: buildUrl(path, options),
		options: options	
	}, callback);
}

var post = function(path, options, callback) {
	request.post({
		uri: buildUrl(path, options),
		options: options	
	}, callback);
}


var crocodoc = function(options) {
	if(options == null) {
		options = defaultOptions;	
	}
	this.defaultOptions = options; 
};

crocodoc.prototype.params = function(options) {
	return merge(options, this.defaultOptions);
}

/***
	Upload and convert a file. This method will stream the file to crocodoc via a POST request.
***/
crocodoc.prototype.upload = function(filePath, options, callback) {
	if(arguments.length == 2 && typeof options === "function") {
		callback = options;
		options = {};
	}
	
	var url = buildUrl("/document/upload");
	var fileName = path.basename(filePath);
	var params = this.params(options);
	
	multipart.post({
		url: url,
		//debug: true,
		file: {
			path: filePath,
			type: "application/octet-stream",
			name: "file",
			fileName: fileName
		},
		params: params
	}, callback);
}

// check the conversion status of a document...
crocodoc.prototype.status = function(uuids, callback) {
	if(arguments.length == 2 && typeof options === "function") {
		callback = options;
		options = {};
	}
	
	options.uuids = uuids.join(",");
	
	var me = this;
	get("/document/status", this.params(options), function(err, res, body) {
		if(err) callback(err, null);
	
		var docs = JSON.parse(body);
		callback(null, docs);
	});
}


// creates a session ID for session-based document viewing (may be used only one) ...
crocodoc.prototype.getSession = function(uuid, options, callback) {
	if(arguments.length == 2 && typeof options === "function") {
		callback = options;
		options = {};
	}
	
	options.uuid = uuid;
	
	var me = this;
	get("/session/get", this.params(options), function(err, res, body) {
		if(err) callback(err, null);
	
		var session = JSON.parse(body);
		session.embeddableUrl = me.getSessionEmbeddableUrl(session.sessionId);
		
		callback(null, session);
	});
}

// view an embedded document. This URL returns a web page that can be embedded within an iframe...
crocodoc.prototype.getSessionEmbeddableUrl = function(sessionId) {
	return  "https://crocodoc.com/view/?sessionId=" + sessionId;
}

crocodoc.prototype.getEmbeddableUrl = function(shortId) {
	return "http://crocodoc.com/" + shortId + "?embedded=true";
}

module.exports = crocodoc;
/*



  # "Delete an uploaded file."
  def delete(uuid, options = {})
    options.merge! :uuid => uuid
    _shake_and_stir_params(options, :uuid, :token)

    _request("/document/delete", :get, options)
  end

  # "Download an uploaded file with or without annotations."
  def download(uuid, options = {})
    options.merge! :uuid => uuid
    _shake_and_stir_params(options, :uuid, :annotated, :token)

    _request_raw("/document/download", :get, options)
  end

  # "Creates a new 'short ID' that can be used to share a document."
  def share(uuid, options = {})
    options.merge! :uuid => uuid
    _shake_and_stir_params(options, :uuid, :editable, :token)

    _request("/document/share", :get, options)
  end

  # "Clones an uploaded document. Document annotations are not copied."
  def clone(uuid, options = {})
    options.merge! :uuid => uuid
    _shake_and_stir_params(options, :uuid, :token)
    
    _request("/document/clone", :get, options)
  end
  */

 