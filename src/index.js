const {updateMenu, getAxiosTemplate, fetchAllRecords, bulkInsert, bulkUpdate, bulkDelete, fetchRecords, getEvents, getRepeaters, replace} = require('./API_Endpoints.js')
const {initAppendments, getAppend1, getAppend2, getAppend3, getAppend4, getDivider} = require('./appendments.js');
const {findStartingContent} = require('./CC_utils.js');
const {extractFutureDate, getNextSunday} = require('./DateUtils.js');
const {getGMail } = require('./gmail_3.js');
const {authorize, google } = require('./google-stuff.js');
const {getArticlesFromHTML, htmlToRichContent, getRCParagraphTemplate, getRCTextTemplate} = require('./htmlToRichContent.js');
const {redactions} = require('./redact.js');
const {getGeneratedDescriptionFromArticle, getLongDescriptionFromArticle, getTextFromArticle, newEvent} = require('./RichContentUtils.js');
const {headers, getSecret} = require('./secrets.js');
const {cleanTitle, normalizeTitle} = require('./TitleUtils.js');
const {initCommonArgs,getOrdinalSuffix, formatDate, generateRandomId,clone, pretty, stop} = require('./utils.js');

console.log("uuseCommons");

module.exports = {initAppendments, getAppend1, getAppend2, getAppend3, getAppend4, initCommonArgs, 
authorize, bulkDelete, bulkInsert, 
bulkUpdate, cleanTitle, getDivider,
extractFutureDate, 
fetchAllRecords, fetchRecords, findStartingContent, formatDate, 
generateRandomId, getArticlesFromHTML, getAxiosTemplate, 
getEvents, getGeneratedDescriptionFromArticle, getGMail, 
getLongDescriptionFromArticle, getNextSunday, getOrdinalSuffix, 
getRCParagraphTemplate, getRCTextTemplate, getRepeaters, getSecret, getTextFromArticle, 
google, headers, htmlToRichContent, 
newEvent, normalizeTitle, redactions,replace, 
updateMenu, clone, pretty, stop}


