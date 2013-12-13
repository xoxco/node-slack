var Slack = require('../slack.js');
var slack = new Slack({
  domain: 'testing',
  token: 'testToken'
});
var insist = require('insist');
var sinon = require('sinon');
var request = require('request');

describe('test send', function(){


  it('should callback with ok', function(done){
    var input = {
      channel: 'test',
      text: 'hello',
      username: 'test'
    };
    sinon.stub(request, 'post', function(options,cb){return cb(null, null, 'ok');});
    slack.send(input, function(err, res){
      insist.ok(!err);
      insist.equal(res, 'ok');
      request.post.restore();
      done();
    });
  });

  it('should use the default channel', function(done){
    var input = {
      text: 'hello',
      username: 'test'
    };
    var expected = {
      url: 'https://testing.slack.com/services/hooks/incoming-webhook?token=testToken',
      body: '{"channel":"#general","text":"hello","username":"test"}'
    };
    sinon.stub(request, 'post', function(options,cb){return cb(null, null, options);});
    slack.send(input, function(err, res){
      insist.deepEqual(err, expected);
      insist.ok(!res);
      request.post.restore();
      done();
    });
  });

  it('should error when we have no message', function(done){
    var input = {};
    var expected = new Error('No message');
    slack.send(input, function(err, res){
      insist.deepEqual(err, expected);
      insist.ok(!res);
      done();
    });
  });

});

describe('test respond', function(){

  it('should respond!', function(){
    var input = {
      token: 'token123',
      team_id: '123',
      channel_id: '2v22c2',
      channel_name: 'test channel',
      timestamp: '2013-12-13T20:59:03.650Z',
      user_id: '1',
      user_name: 'test',
      text: 'Test text'
    };
    var expected = {
      token: 'token123',
      team_id: '123',
      channel_id: '2v22c2',
      channel_name: 'test channel',
      timestamp: new Date('2013-12-13T20:59:03.650Z'),
      user_id: '1',
      user_name: 'test',
      text: 'Test text'
    };
    var result = slack.respond(input);
    insist.deepEqual(result, expected);
  });

  it('should callback', function(done){
    var input = {
      token: 'token123',
      team_id: '123',
      channel_id: '2v22c2',
      channel_name: 'test channel',
      timestamp: '2013-12-13T20:59:03.650Z',
      user_id: '1',
      user_name: 'test',
      text: 'Test text'
    };
    var expected = {
      token: 'token123',
      team_id: '123',
      channel_id: '2v22c2',
      channel_name: 'test channel',
      timestamp: new Date('2013-12-13T20:59:03.650Z'),
      user_id: '1',
      user_name: 'test',
      text: 'Test text'
    };
    slack.respond(input, function(err, result){
      insist.ok(!err);
      insist.deepEqual(result, expected);
      done();
    });
  });


});
