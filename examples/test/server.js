var Crocodoc = require("../../main.js"),  //require("node-crocodoc");
	express = require('express'),
	crypto = require('crypto');

var app = express.createServer();

var crocodoc = new Crocodoc({
	token: "[KEY GOES HERE],
	async: false,
	private: false,
	editable: false,
	downloadable: true
});

app.register(".html", require("ejs"));

app.set("views", __dirname + "/views");
app.set("view engine", "html");

var docs = [{
	id: "3453e09fce1c9d707b7eb6844b2442d403ca9084",
	name: "Document 1",
	uuid: "cb036f01-88b6-45b1-b9f9-03f840683705"
},{
	id: "97678bc64efdcf8f492140b482b052d94905a483",
	name: "Document 2",
	uuid: "3796eba0-d193-4271-a68d-4b0b59f6762d"
}, {
	id: "04fa700187caa41e677315127c10f6131acda5c6",
	name: "Document 3",
	uuid: "71f1640c-71d1-4455-a6e6-9dc86e842d5f"
}];

app.get('/', function(req, res){
	res.render("index", {
		docs: docs
	});
});

app.param('id', function(req, res, next, id){
	
	var uuid;
	docs.forEach(function(doc) {
		if(doc.id == id) {
			uuid = doc.uuid;
		}
	});
	
	if(uuid) {
		crocodoc.getSession(uuid, { private: true }, function(err, session) {
			req.session = session;
		  	next();
		});
	} else {
		res.send("This is not the document you're looking for", 404);
	}
});


app.get('/:id', function(req, res){
	res.render('view', { 
		session: req.session
	});
});

app.listen(3000);
console.log('Express/Crocodoc app started on port 3000');

