const {updateMenu, getAxiosTemplate, fetchAllRecords, bulkInsert, bulkUpdate, bulkDelete, fetchRecords, getEvents, getRepeaters, replace} = require('./API_Endpoints.js')
const {append1, append2, append3, append4, divider} = require('./appendments.js');
const {findStartingContent} = require('./CC_utils.js');
const {extractFutureDate, getNextSunday} = require('./DateUtils.js');
const {listEmails, getGMail } = require('./gmail_3.js');
const {authorize, google } = require('./google-stuff.js');
const {getArticlesFromHTML, htmlToRichContent, getAllArticles, getRCParagraph, getRCText} = require('./htmlToRichContent.js');
const {redactions} = require('./redact.js');
const {getGeneratedDescriptionFromArticle, getLongDescriptionFromArticle, getTextFromArticle, newEvent} = require('./RichContentUtils.js');
const {headers, getSecret} = require('./secrets.js');
const {cleanTitle, normalizeTitle} = require('./TitleUtils.js');
const {argv, getOrdinalSuffix, formatDate, generateRandomId, month, date, ISOdate, capture, doNotUpdate, eBlastCMS, repeatersCMS, happeningsCMS, newsLetterCMS, clone, pretty, stop} = require('./utils.js');

console.log("uuseCommons");

module.exports = {append1, append2, append3, append4, argv, authorize, bulkDelete, bulkInsert, 
bulkUpdate, capture, cleanTitle, date, ISOdate, divider, doNotUpdate, eBlastCMS,
extractFutureDate, 
fetchAllRecords, fetchRecords, findStartingContent, formatDate, 
generateRandomId, getAllArticles, getArticlesFromHTML, getAxiosTemplate, 
getEvents, getGeneratedDescriptionFromArticle, getGMail, 
getLongDescriptionFromArticle, getNextSunday, getOrdinalSuffix, 
getRCParagraph, getRCText, getRepeaters, getSecret, getTextFromArticle, 
google, happeningsCMS, headers, htmlToRichContent, listEmails, month, 
newEvent, newsLetterCMS, normalizeTitle, redactions, repeatersCMS, replace, 
updateMenu, clone, pretty, stop}


