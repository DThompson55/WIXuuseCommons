"use strict"
//tester
console.log("HELLO WORLD FROM UUSE COMMONS");

const { mySecret,getSecret} = require('./secrets.js');
const {authorize,google} = require('./OLD/google-stuff.js');
const {htmlToRichContent} = require('./htmlToRichContent.js');
const {formatDateToYYYYMMDD, argv, getOrdinalSuffix, formatDate, generateRandomId } = require('./utils.js');

