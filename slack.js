var request = require('request');

function Slack(options) {
	this.domain = null;
	this.token = null;
	this.defaultChannel = '#general';
	if( options && options instanceof Object ){
		this.domain = options.domain;
		this.token = options.token;
		if( options.defaultChannel ) this.defaultChannel = options.defaultChannel;
	}
}

Slack.prototype.send = function(message,cb) {
	if( !( message && message instanceof Object && message.text ) ) {
		if( cb && cb instanceof Function ) return cb(new Error('No message'));
		return 'No message';
	}

	var url = 'https://' + this.domain + '.slack.com/services/hooks/incoming-webhook?token=' + this.token;
	var options = {
		"channel":message.channel || this.defaultChannel,
		"text": message.text,
		"username":message.username
	};

	var requestParams = {
		url:url,
		body:JSON.stringify(options)
	}

	request.post(requestParams, function(err,res,body) {
		if(err || body != 'ok') {
			if( cb && cb instanceof Function ) return cb(err || body);
		}

		if (cb && cb instanceof Function) cb(err,body);

	});
}


Slack.prototype.respond = function(query,cb) {
	var obj = {};

	obj.token = query.token;
	obj.team_id = query.team_id;
	obj.channel_id = query.channel_id;
	obj.channel_name = query.channel_name;
	obj.timestamp = new Date(query.timestamp);
	obj.user_id = query.user_id;
	obj.user_name = query.user_name;
	obj.text = query.text;

	if (!( cb && cb instanceof Function ) ) {
		return obj;
	} else {
		return cb(null, obj);
	}
}

module.exports = Slack;
