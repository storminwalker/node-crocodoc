Node API client for Crocodoc
============================

This is a very simple wrapper over the Crocodoc Web API. Pretty must just maps to what's available in the [Crocodoc API docs](http://crocodoc.com/api/)

Installation
------------

	npm install node-crocodoc

Requires [request](https://github.com/mikeal/request).
	
Usage
-----

	var Crocodoc = require("node-crocodoc");

	// instaniate an instance of the API with some default options
	var crocodoc = new Crocodoc({
		token: "[KEY GOES HERE],
		async: false,
		private: false,
		editable: false,
		downloadable: true
	});

	var uuid = [some uuid];
	
	// get private access to a document
	crocodoc.getSession(uuid, { private: true }, function(err, session) {
		console.log(session);
	});
	
	// same method - defaults to default options set in the constructor
	crocodoc.getSession(uuid, function(err, session) {
		console.log(session);
	});
	
	// delete a document
	crocodoc.delete(uuid, function(err, res) {
		console.log(res);
	});
	
	// check the status of a document (you can also pass in an array of uuids)
	crocodoc.stats(uuid, function(err, res) {
		console.log(res);
	});
	
	
	


