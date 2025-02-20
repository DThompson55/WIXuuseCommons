"use strict"
const he = require('he');

function redactions(text,redaction, verbose=false){

  if ( verbose ) console.log("called redactions",text,redaction)

  if (redaction) {
    text = redactZoom(redactUSPhoneNumbers(redactEmailAddresses(text, verbose)))
  }
//  text = text.replace(/(\s*the\s*)?Click here for the Zoom link/gi, "Contact the office for the Zoom link");

//  text = text.replace(/ü/g,"");
  text = text.replace("<![if !supportLists]>","•")
  text = text.replace("<![endif]>","")
  text = text.replace(/&#xa0;/g, ' '); // nonbreaking space
  text = text.replace(/&#xfeff;/g, ' '); // a different kind of nonbreaking space
  text = text.replace(/&#xfeff;/g, ' '); // a different kind of nonbreaking space
  text = text.replace(/\r\n/g, ' ');
  
//  if (text.length == 1) console.log("Here a single character maybe",text,(text==="o"));
  if (text === "o") text = "";
  if (text === "ü") text = "";

  if (text.includes("supportLists")) {console.log(text); abend();}
  
  // Decode HTML entities
  text = he.decode(text);
  text = text.replace(/(?!^)\s+/g, ' ');
  return text;
}

function redactUSPhoneNumbers(text) {
  // Regular expression to match US phone numbers
  var regex = /\b(\d{3})([-.]|\s)?(\d{3})([-.]|\s)?(\d{4})\b/g;
  var redactedText = text.replace(regex, "860-646-5151");
  return redactedText;
}

function redactEmailAddresses(text,verbose) {
  if (verbose)console.log("redacting",text,(text.indexOf("uuse.org")<0))
  // Regular expression to match email addresses
  var regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  if (text.indexOf("uuse.org")<0)
     text = text.replace(regex, "uuseoffice@uuse.org");
  if (verbose)console.log("redacted",text)
  return text;
}

function redactZoom(text) {
// Regular expression to match zoom.us URLs
var zoomUsRegex = /https?:\/\/(?:uuma\.)?zoom\.us\/\S+/gi;
// Replacement URL
var replacementUrl = "Contact the Office for Zoom Link";
// Replace zoom.us URLs with the replacement URL
var modifiedText = text.replace(zoomUsRegex, replacementUrl);
return modifiedText

}

module.exports = {redactions}