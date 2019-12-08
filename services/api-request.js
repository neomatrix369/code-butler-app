"use strict";

const querystring = require('querystring'), 
      http = require('http'),
      https = require('https');

const host = 'localhost';
const port = '5000'

module.exports = {
  performRequest: function(host, port, path, cb_success) { 
    const options = {
      host: host,
      port: port,
      path: path
    };

    http.get(options, function(res) {
      var answer = "No answer(s) returned";
      console.log('Response: ' + res);
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
    
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        cb_success(chunk);
      });
    }).end();
  },

  askQuestion: function(question, success) {
    console.log("askQuestion.success = " + success);
    if (!question.includes("<mask>")) {
      question = question.trim() + " <mask>"
    }

    this.performRequest(
      host,
      port, 
      '/askQuestion' + encodeURI("?question=\'" + question + "\'"),
      success
    );
  }
}