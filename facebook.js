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
var eventsUrl = 'https://www.facebook.com/events/birthdays/';
var wallUrl = loginUrl + username.split('@')[0];  // Assuming the email id is your facebook page vanity url.
casper.start().thenOpen(loginUrl, function() {
	console.log(username);
    console.log("Facebook website opened");
});

casper.then(function(){
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
		this.capture('login.png');
	}, 10000); // timeout limit in milliseconds
});

casper.thenOpen(wallUrl, function(){
	this.waitForSelector("#fbTimelineHeadline", function pass(){
		console.log("capturing your profile page screenshot")
		this.capture('profile.png');
	}, function fail(){
		console.log("did not redirect");
	}, 1000);
});

casper.then(function(){
	// Do whatever you want to do on the page using vanilla JS;
	var image = this.evaluate(function(){
		var imageSrc = document.querySelectorAll('img[class="coverPhotoImg photo img"]')[0].src;

		//friendlistselect0r document.querySelectorAll('div[data-testid="friend_list_item"]')/
		return imageSrc;
	});
	console.log(image);
	this.download(image, 'image.jpg');
});

casper.thenOpen(eventsUrl, function(){
	this.evaluate(function(){
		var birthdays = document.querySelectorAll('div[class="_4-u2 _tzh _fbBirthdays__todayCard _4-u8"] .enter_submit');
		for(var i = 0; i < birthdays.length; i++){
			birthdays[i].value = "Happy Birthday !!";			
			//webkit - initKeyboardEvent
			var ev = document.createEvent('KeyboardEvent');
			ev.initKeyEvent('keydown', true, true, window, false, false, false, false, 13, 0);  // 13 = Enter`
			birthdays[i].dispatchEvent(ev);

		}
	});
	this.capture('birthdays.png');
});


casper.on('resource.requested', function(requestData, resource) {
    // console.log(decodeURI(requestData.url));
	
});
casper.on('remote.message', function(message) {
    // this.echo('Message :: ' + message);
});
casper.run();
