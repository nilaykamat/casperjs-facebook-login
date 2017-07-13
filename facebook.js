var casper = require("casper").create({
    pageSettings: {
        loadImages: false,//The script is much faster when this field is set to false
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
var wallUrl = loginUrl + username.split('@')[0];  // Assuming the email id is your facebook page vanity url.

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
		console.log("Logged In Successfully");
	}, function fail () {
		console.log("did not Log In");
	}, 1000); // timeout limit in milliseconds
});

casper.thenOpen(wallUrl, function(){
	this.waitForSelector("#fbTimelineHeadline", function pass(){
		console.log("capturing your profile page screenshot")
		this.capture('profile.png');
	}, function fail(){
		console.log("did not redirect");
	}, 1000);
});
casper.on('resource.requested', function(requestData, resource) {
    // console.log(decodeURI(requestData.url));
});

casper.run();