var casper = require("casper").create({
    pageSettings: {
        loadImages: true,//The script is much faster when this field is set to false
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0'
    },
	viewportSize: {
        width: 1920,
        height: 1080
    }
});
var utils = require("utils");

var username = casper.cli.get('username');
var password = casper.cli.get('password');

var loginUrl = 'https://www.facebook.com/';
var wallUrl = 'https://www.facebook.com/nilaykamat';

casper.start().thenOpen(loginUrl, function() {
    console.log("Facebook website opened");
});

casper.then(function(){
	console.log(username);
	this.evaluate(function(username, password){
        document.getElementById("email").value = username;
		document.getElementById("pass").value = password;
		document.querySelectorAll('input[type="submit"]')[0].click();
    },{
		username : username,
		password : password
	});
});

casper.then(function(){
	this.waitForSelector("#pagelet_composer", function pass () {
			casper.scrollToBottom();
			casper.wait(5000);
			casper.scrollToBottom();
			casper.wait(5000);
			casper.scrollToBottom();
			casper.wait(5000);
			casper.scrollToBottom();
			casper.wait(5000);
			this.capture('fdvvt.png');
			console.log("captured image");
		}, function fail () {
			console.log("did not Log In");
		},
		20000 // timeout limit in milliseconds
	);
});

casper.thenOpen(wallUrl, function(){
	this.waitForSelector("#fbTimelineHeadline", function pass(){
		this.capture('fdvvt.png');
	}, function fail(){
		console.log("did not redirect");
	});
});
casper.on('resource.requested', function(requestData, resource) {
    // console.log(decodeURI(requestData.url));
});

casper.run();