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

// const i18n = require("../i18n.config");
const i18n = require("../i18n")

module.exports = class Response {
  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }

  static genImageTemplate(image_url, title, subtitle = "") {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url
            }
          ]
        }
      }
    };

    return response;
  }

  static genButtonTemplate(title, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons
        }
      }
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text
    };

    return response;
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genWebUrlButton(title, url) {
    let response = {
      type: "web_url",
      title: title,
      url: url,
      messenger_extensions: true
    };

    return response;
  }

  static getRandomKey(list) {
    const max = list.length
    var result = ""
    if (max > 0) {
      const randomIndex = Math.floor(Math.random() * max)
      result = list[randomIndex]
    } else {
      result = "" 
    }
    return result
  }

  static getRandomWelcomeMessageKey() {
    return this.getRandomKey([
      "get_started.welcome_1", 
      "get_started.welcome_2", 
      "get_started.welcome_3"
    ])
  }

  static genNuxMessage(user) {   
    let welcome = this.genText(
      i18n.__(this.getRandomWelcomeMessageKey(), {
        userFirstName: user.firstName
      })
    );

    let guide = this.genText(i18n.__("get_started.guidance"));

    let level = this.genQuickReply(i18n.__("get_started.help"), [{
        title: i18n.__("menu.basic"),
        payload: "BASIC"
      },
      {
        title: i18n.__("menu.advance"),
        payload: "ADVANCE"
      }
    ]);

    let languages = this.genQuickReply(i18n.__("get_started.help"), [{
        title: i18n.__("menu.java"),
        payload: "PROGRAMMING_LANGUAGE_JAVA"
      },
      {
        title: i18n.__("menu.javascript"),
        payload: "PROGRAMMING_LANGUAGE_JAVASCRIPT"
      },
      {
        title: i18n.__("menu.python"),
        payload: "PROGRAMMING_LANGUAGE_PYTHON"
      },
      {
        title: i18n.__("menu.cobol"),
        payload: "PROGRAMMING_LANGUAGE_COBOL"
      },
      {
        title: i18n.__("menu.algol"),
        payload: "PROGRAMMING_LANGUAGE_ALGOL"
      },
      {
        title: i18n.__("menu.fortran"),
        payload: "PROGRAMMING_LANGUAGE_FORTRAN"
      }
    ]);

    return [welcome, guide, level];
  }
};
