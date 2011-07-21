var Crocodoc = require("../../main.js"); //require("node-crocodoc");


/*
{"shortId": "iYMPtlQ", "uuid": "cb036f01-88b6-45b1-b9f9-03f840683705"}
{"shortId": "kHyc7WN", "uuid": "3796eba0-d193-4271-a68d-4b0b59f6762d"}
{ shortId: 'h7rqEec', uuid: '71f1640c-71d1-4455-a6e6-9dc86e842d5f' }
*/

var crocodoc = new Crocodoc({
	token: "dtSHMcKLoQGqh74rWjvF",
	async: false,
	private: false,
	editable: false,
	downloadable: true
});

crocodoc.getSession("cb036f01-88b6-45b1-b9f9-03f840683705", { private: true }, function(err, session) {
	console.log(session);
});


var express = require('express');

var app = express.createServer();

// Register ejs as .html

app.register('.html', require('ejs'));

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Dummy users
var users = [
    { name: 'tj', email: 'tj@sencha.com' }
  , { name: 'ciaran', email: 'ciaranj@gmail.com' }
  , { name: 'aaron', email: 'aaron.heckmann+github@gmail.com' }
];

app.get('/', function(req, res){
  res.render('users', { users: users });
});

app.listen(3000);
console.log('Express app started on port 3000');

