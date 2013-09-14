# node-slack

a node module for sending and receiving messages with Slack via webhooks.

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


To reeive a message, pass the information from the webhook into slack.respond, 
along with a callback function responsible for returnign a response.

From inside an Express.js route, this is as easy as passing in req.body:

```
app.post('/yesman',function(req,res) {
	
	var txt = slack.respond(req.body,function() {
		
		return {
			text: 'Good point, ' + this.user_name,
			username: 'Bot'
		};
		
		
	});
	
	res.json(txt);

});
```