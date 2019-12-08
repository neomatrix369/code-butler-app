/**
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Code Butler
 *
 */



const i18n = require("i18n"), debug = require('debug')('i18n:debug'),
  path = require("path");

i18n.configure({
  locales: [
    "en_GB",
    // "en_US",
    // "fr_FR",
    // "es_ES",
    // "es_LA",
    // "pt_BR",
    // "id_ID",
    // "ar_AR",
    // "de_DE",
    // "it_IT",
    // "ja_JP",
    // "ko_KR",
    // "ru_RU",
    // "th_TH",
    // "vi_VN",
    // "zh_CN",
    // "zh_HK",
    // "zh_TW"
  ],
  // updateFiles: false,
  // logDebugFn: function (msg) {
  //     console.log('debug', msg);
  // },
  defaultLocale: "en_GB",
  directory: path.join(__dirname, "locales"),
  objectNotation: true,
  api: {
    __: "translate",
    __n: "translateN"
  }
});

module.exports = i18n;
