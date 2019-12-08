const path = require("path");
const fs = require("fs");

module.exports = {
	getLocale: function() {
		return "en_GB";
	},

	getLocales: function() {
	  return ["en_GB"];
	},

	__: function(token) {
	  const directory = path.join(__dirname, "locales");
	  const localeFileName = path.join(directory, this.getLocale() + ".json");
	  const localeFileContent = fs.readFileSync(localeFileName, "utf8");
	  const localeFileAsJson = JSON.parse(localeFileContent);

	  const splitToken = token.split(".");
	  const grouping = splitToken[0];
	  const key_in_grouping = splitToken[1];

	  try {
	  	return localeFileAsJson[grouping][key_in_grouping];	
	  } catch(error) {
	  	console.log("Error message: " + error.message);
	  	console.log(`Error occurred for token='${token}'`);
	  	throw(error);
	  }
	},

	setLocale: function(user_locale) {
		// set user locale
	}
}


// module.exports = getLocale, getLocales, __, setLocale;