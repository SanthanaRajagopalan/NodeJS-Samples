/**
* Description: Sample Rest Service. 
* Date: 7/16/2014
*/
var express = require('express'),
    fs = require('fs'),
    dns = require('dns'),
    hostName = require('os').hostname(),
    htmlContent,
	delay = 1000,
	bodyParser = require('body-parser'),
	util = require('util');

var app = express();

app.set('views', __dirname + '/views/template');
app.set('view engine', 'jade');

// Enables CORS
var enableCORS = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};
 
// enable CORS!
app.use(enableCORS);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

function response(req, res) {
	var fileName,
		resourceName;
		fs.writeFile("/tmp/sandylog", util.inspect(req) , 'utf-8', function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was saved!");
		    }
		});

	if (req.params.name) {
		resourceName = req.params.name;
		if (resourceName.indexOf(".html") > 0) {
			fileName = "./response/" + resourceName;
		} else if (resourceName.indexOf(".json") > 0) {
			fileName = "./response/" + resourceName;
		} else if (resourceName.indexOf(".png") > 0) {
			fileName = "./response" + resourceName;
		} else if (resourceName.indexOf(".xml") > 0) {
			fileName = "./response" + resourceName;
		} else if (resourceName.indexOf(".jpeg") > 0) {
			fileName = "./response" + resourceName;
		}
	}
	fs.readFile(fileName, 'utf8', function (err, html) {
		if (err) {
			throw err;
		}
		console.log("Sending Response", new Date());
		htmlContent = html.toString();

		setTimeout(function () {
			res.header("200");
			res.header('Content-Type:text/html');
			res.header('Content-Length:' + htmlContent.length);
			res.send(htmlContent);
        }, delay);
	});

}

function postResponse(req, res) {
	console.log("request header", res._headers, res._headerNames, req.headers, req.method);
	if(req.body) {
			res.header("200");
			res.render('resp', { parameters: JSON.stringify(req.body), date: new Date()});
	}
}

app.get('/', function(req, res){
	res.status(200);
	res.render('index');
});

app.get('/404', function(req, res){
	res.status(200);
	res.render('index');
});

app.get('/getResponse/:name', response);
app.post('/postResponse', postResponse);

// 404 route
app.get('*', function(req, res){
res.status(404);
res.render('404', { url: req.url });
});

dns.lookup(hostName, function (err, addr, fam) {
	var server = app.listen(9090, addr, function () {
		console.log('App is running at URL http://%s:%s', server.address().address, server.address().port,server.address(),hostName);
	});
});
