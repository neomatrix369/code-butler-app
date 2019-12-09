/**
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Code Butler
 *
 */

"use strict";

const Response = require("./response"),
  ProgrammingLanguages = require("./programming-languages"),
  GraphAPi = require("./graph-api"),
  i18n = require("../i18n"),
  ApiRequest = require("./api-request")

module.exports = class Receive {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;

    let responses;

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  // Handles messages events with text
  handleTextMessage() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.user.psid}`
    );

    // check greeting is here and is confident
    let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");

    let message = this.webhookEvent.message.text.trim().toLowerCase();
    let originalMessage = this.webhookEvent.message.text.trim();

    let response;
    let that = this;

    if (
      (greeting && greeting.confidence > 0.8) ||
      message.includes("start over")
    ) {
      response = Response.genNuxMessage(this.user);
    } else if (message.includes(i18n.__("care.help").toLowerCase())) {
      let programmingLanguages = new ProgrammingLanguages(this.user, this.webhookEvent);
      response = programmingLanguages.handlePayload("LEVEL");
    } else if (message.includes(i18n.__("get_started.choose_language").toLowerCase())) {
      let programmingLanguages = new ProgrammingLanguages(this.user, this.webhookEvent);
      response = programmingLanguages.handlePayload("PROGRAMMING_LANGUAGE");
    } else if (i18n.__("java.when_created_question").toLowerCase().includes(message)) {
      response = Response.genText(i18n.__("java.when_created_answer")) 
    } else if (i18n.__("java.who_created_question").toLowerCase().includes(message)) {
      response = Response.genText(i18n.__("java.who_created_answer")) 
    } else if (i18n.__("java.best_ide_question").toLowerCase().includes(message)) {
      response = Response.genText(i18n.__("java.best_ide_answer")) 
    } else {
      console.log("original message = ", originalMessage);
      setTimeout( () => ApiRequest.askQuestion(originalMessage, function(answer){
        const answer_annotated = answer.replace("'", "")
                                       .replace("'", "")
                                        + " (AI Model)";
        console.log("answer = ", answer_annotated);
     
        if (!answer || ( !answer.includes(originalMessage ))) {
             that.sendMessage(Response.genText(
                  i18n.__("fallback.any", {
                    message: this.webhookEvent.message.text
                  })
                ))
        } else {
          that.sendMessage(Response.genText(answer_annotated))
        }
      }), 1000);
      response = Response.genText("(thinking...)");
    }

    return response;
  }

  // Handles mesage events with attachments
  handleAttachmentMessage() {
    let response;

    // Get the attachment
    let attachment = this.webhookEvent.message.attachments[0];
    console.log("Received attachment:", `${attachment} for ${this.user.psid}`);

    response = Response.genQuickReply(i18n.__("fallback.attachment"), [
      {
        title: i18n.__("menu.help.receive"),
        payload: "PROGRAMMING_LANGUAGE"
      },
      {
        title: i18n.__("menu.start_over"),
        payload: "GET_STARTED"
      }
    ]);

    return response;
  }

  // Handles mesage events with quick replies
  handleQuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  // Handles postbacks events
  handlePostback() {
    let postback = this.webhookEvent.postback;
    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      // Get the payload of the postback
      payload = postback.payload;
    }
    return this.handlePayload(payload.toUpperCase());
  }

  // Handles referral events
  handleReferral() {
    // Get the payload of the postback
    let payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }

  handlePayload(payload) {
    console.log("Received Payload:", `${payload} for ${this.user.psid}`);

    // Log CTA event in FBA
    GraphAPi.callFBAEventsAPI(this.user.psid, payload);

    let response;
    console.log(payload)
    // Set the response based on the payload
    if (
      payload === "GET_STARTED" ||
      payload === "DEVDOCS" ||
      payload === "GITHUB"
    ) {
      response = Response.genNuxMessage(this.user);
    } else if (payload.includes("PROGRAMMING_LANGUAGE") || payload.includes("PROGRAMMING_LANGUAGE_JAVA")) {
      let programmingLanguages = new ProgrammingLanguages(this.user, this.webhookEvent);
      response = programmingLanguages.handlePayload(payload);
    } else if (payload.includes("BASIC") || payload.includes("ADVANCED")) {
      let programmingLanguages = new ProgrammingLanguages(this.user, this.webhookEvent);
      response = programmingLanguages.handlePayload(payload);
    } else {
      response = {
        text: `This is a default postback message for payload: ${payload}!`
      };
    }

    return response;
  }

  handlePrivateReply(type,object_id) {
    let welcomeMessage = i18n.__("get_started.welcome") + " " +
      i18n.__("get_started.guidance") + ". " +
      i18n.__("get_started.help");

    let response = Response.genQuickReply(welcomeMessage, [
      {
        title: i18n.__("menu.suggestion.receive"),
        payload: "CURATION"
      },
      {
        title: i18n.__("menu.help.receive.PrivateReply"),
        payload: "PROGRAMMING_LANGUAGE"
      }
    ]);

    let requestBody = {
      recipient: {
        [type]: object_id
      },
      message: response
    };

    GraphAPi.callSendAPI(requestBody);
  }

  sendMessage(response, delay = 0) {
    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.user.psid
      },
      message: response
    };

    // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.user.psid
        },
        message: response,
        persona_id: persona_id
      };
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
};
