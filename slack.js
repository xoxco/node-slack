"use strict";

var request = require('axios');
var deferred = require('deferred');

function Slack(hook_url, http_proxy_options) {
  this.hook_url = hook_url;
  this.http_proxy_options = http_proxy_options;
}

Slack.prototype.send = function (message, cb) {
  if (!message.text) {
    if (cb) cb.call(null, { message: 'No text specified' }, null);
    return;
  }

  var command = this.hook_url;
  var body = {
    text: message.text,
  };

  if (message.username) { body.username = message.username; }
  if (message.channel) { body.channel = message.channel; }
  if (message.icon_url) { body.icon_url = message.icon_url; }
  if (message.icon_emoji) { body.icon_emoji = message.icon_emoji; }
  if (message.attachments) { body.attachments = message.attachments; }
  if (message.unfurl_links) { body.unfurl_links = message.unfurl_links; }
  if (message.link_names) { body.link_names = message.link_names; }

  var option = {
    proxy: (this.http_proxy_options && this.http_proxy_options.proxy) || process.env.https_proxy || process.env.http_proxy,
    url: command,
    body: JSON.stringify(body)
  };

  if (!cb) var d = deferred();

  let req = axios.post(config.url, config.data, { headers: config.headers })
    .then((response) => {
      const res = response;
      const body = response.data;
      if (!body || body !== "ok") {
        let err = { message: body };
        throw err;
      }
      if (d) {
        return d.resolve({ res, body });
      } else if (cb) {
        return cb.call(null, null, body);
      }
    })
    .catch((error) => {
      if (d) {
        d.reject(error || { message: 'Axios Request error' });
      } else if (cb) {
        return cb.call(null, error || { message: 'Axios Request error' }, null);
      }
    });

  return d ? d.promise : req;
};


Slack.prototype.respond = function (query, cb) {
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
    return { text: '' };
  } else {
    return cb.call(null, obj);
  }
};

module.exports = Slack;
