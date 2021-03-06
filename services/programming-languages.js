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

// Imports dependencies
const Response = require("./response"),
  config = require("./config"),
  i18n = require("../i18n");

const getRandomKey = function(list) {
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

const allLanguages = function() {
  return [
            {
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
  ];
}

module.exports = class ProgrammingLanguages {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case "BASIC":
        response = Response.genQuickReply(
            i18n.__("get_started.choose_language"),
            allLanguages()
        )
        break;
      case "ADVANCED":
        response = Response.genQuickReply(
            i18n.__("get_started.choose_language") + " " + i18n.__("advanced.hint"),
            allLanguages()
        )
        break;

      case "PROGRAMMING_LANGUAGE_JAVA":
        response = { 
          text: i18n.__("java.welcome") 
        };
        break;

      case "PROGRAMMING_LANGUAGE_JAVASCRIPT":
      case "PROGRAMMING_LANGUAGE_PYTHON":
      case "PROGRAMMING_LANGUAGE_ALGOL":
      case "PROGRAMMING_LANGUAGE_COBOL":
      case "PROGRAMMING_LANGUAGE_FORTRAN":
        const responseText = i18n.__(getRandomKey(["not_available.language_1", "not_available.language_2"]), {
            userFirstName: this.user.firstName
        }) + " " + i18n.__("get_started.choose_another_language");
        response = Response.genQuickReply(
            responseText,
            allLanguages()
        )
        break;
    }

    return response;
  }
};
