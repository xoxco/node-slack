# node-slack

A node module for sending and receiving messages with Slack via webhooks.

[Slack](https://slack.com/) is a messaging platform that is easy to integrate with. 
This module should be useful for creating various integrations with Slack, such as
chat bots!

## Install Slack

node-slack is available via npm:

```
npm install node-slack
```


Get your custom domain and token from Slack.

Domain is the first part of your <domain>.slack.com.

Token is provided on the integration setup page.

```
var Slack = require('node-slack');
var slack = new Slack(domain,token);
```


To send a message, call slack.send:

```
slack.send({
	text: 'Howdy!',
	channel: '#foo',
	username: 'Bot'
});
```


To respond to a message, pass the information from the webhook into slack.respond, 
along with a callback function responsible for returnign a response.

From inside an Express.js route, this is as easy as passing in req.body:

```
app.post('/yesman',function(req,res) {
	
	var reply = slack.respond(req.body,function(hook) {
		
		return {
			text: 'Good point, ' + hook.user_name,
			username: 'Bot'
		};
		
	});
	
	res.json(reply);

});

```