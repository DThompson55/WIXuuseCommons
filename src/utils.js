"use strict"
const yargs = require('yargs')

function formatDate(date) {
  return date.toISOString().substring(0,10);
}

// Define command-line options and arguments
const argv = yargs
  .option('update', {
    describe: "Whether to update the live site or not",
    type: 'boolean',
    default: false,
  })
  .option('capture', {
    alias: 'cap',
    describe: "Captures the website and write it to original.html",
    type: 'boolean',
    default: false,
  })
  .option('verbose', {
    alias: 'v',
    describe: 'show more console logs',
    type: 'boolean',
    default: false,
  })
  .option('date', {
    describe: 'provide a search date for emails',
    type: 'string',
    default: new Date(), // formatDateToYYYYMMDD(new Date())
  })
  .option('month', {
    describe: 'Provide a text data for the web pages',
    required: true,
    choices: [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
],
    type: 'string',
    default: getMonth(new Date()),
  })
   .option('help', {
    alias: '?',
    describe: 'Show this help',
    type: 'boolean',
    default: false,
  })
  .middleware((argv) => {
    argv.date = new Date(argv.date)//.replace(/-/g, "/");
  })
  .strict()
  .argv;

function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}



function getMonth(date) {
  const choices= [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
]
  const month = choices[date.getMonth()];
  return month;
}  



function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

const verbose = argv.verbose;
const delete_enabled = argv.delete;
const purge_enabled = argv.purge;

const longString = "                                                                         ";
const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];  // List of all header tags
var theRoute = [];

const doNotUpdate   = !(argv.update);
const eBlastCMS     = (doNotUpdate?"Import433":"eBlast");
const repeatersCMS  = (doNotUpdate?"Import853":"Events");
const happeningsCMS = (doNotUpdate?"Import857":"Happenings"); // events
const newsLetterCMS = (doNotUpdate?"Import147":"NewsLetterContents");

module.exports = {argv, 
  getOrdinalSuffix, formatDate, generateRandomId, 
  month:argv.month, date:formatDate(argv.date), capture:argv.capture, doNotUpdate, eBlastCMS, 
  repeatersCMS, happeningsCMS, newsLetterCMS};
