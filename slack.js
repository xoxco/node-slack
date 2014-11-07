"use strict";

var request  = require('request');
var deferred = require('deferred');

function Slack(hookUrl, http_proxy_options) {
  this.hookUrl = hookUrl;
  this.http_proxy_options = http_proxy_options;
}

Slack.prototype.send = function(message, cb) {
  if (!message.text) {
    if (cb) cb.call(null,{message:'No text specified'},null);
    return;
  }
  if (!message.channel) { message.channel = '#general'; }

  var body = {
    channel:  message.channel,
    text:     message.text,
    username: message.username
  };

  if (message.icon_url) { body.icon_url = message.icon_url; }
  if (message.icon_emoji) { body.icon_emoji = message.icon_emoji; }
  if (message.attachments) { body.attachments = message.attachments; }
  if (message.unfurl_links) { body.unfurl_links = message.unfurl_links; }
  if (message.link_names) { body.link_names = message.link_names; }

  var option = {
    proxy: (this.http_proxy_options && this.http_proxy_options.proxy) || process.env.https_proxy || process.env.http_proxy,
    url:   this.hookUrl,
    body:  JSON.stringify(body)
  };

  if(!cb) var d = deferred();

  var req = request.post(option, function(err, res, body) {
    if (!err && body!='ok') {
      err = {message: body};
      body = null;
    }
    if (d) return err ? d.reject(err) : d.resolve({res: res, body: body});
    if (cb) return cb.call(null, err, body);
    return null;
  });

  return d ? d.promise : req;
};


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

  if (!cb) {
    return {text:''};
  } else {
    return cb.call(null,obj);
  }
};

module.exports = Slack;
