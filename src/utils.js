"use strict"
const yargs = require('yargs')

function formatDate(date) {
  return date.toISOString().substring(0,10);//+'T04:00:00.000Z';
}

function isoT4Date(date){
  const isoDate = date.toISOString().split('T')[0]; // e.g., "2025-06-18"
  return new Date(`${isoDate}T04:00:00.000Z`);
}

let commonArgs = {};//{date: new Date()}

function initCommonArgs(verbose=false){
// Define command-line options and arguments
//  throw new Error("INIT COMMON ARGS");
commonArgs = yargs
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
    default: new Date().toISOString().slice(0, 10).replace(/-/g, "/")
    //isoT4Date(new Date())
  })
  .option('month', {
    describe: 'Provide a text data for the web pages',
    choices: [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
],
    type: 'string',
  })
   .option('help', {
    alias: '?',
    describe: 'Show this help',
    type: 'boolean',
    default: false,
  })
  .middleware((commonArgs) => {
    commonArgs.date = new Date(commonArgs.date)//.replace(/-/g, "/");
    commonArgs.doNotUpdate   = !(commonArgs.update);
    commonArgs.eBlastCMS     = (commonArgs.doNotUpdate?"Import433":"eBlast");
    commonArgs.repeatersCMS  = (commonArgs.doNotUpdate?"Import853":"Events");
    commonArgs.happeningsCMS = (commonArgs.doNotUpdate?"Import857":"Happenings"); // events
    commonArgs.newsLetterCMS = (commonArgs.doNotUpdate?"Import147":"NewsLetterContents");

  })
  .strict()
  .parse();

if (verbose) console.log("commonArgs = ", commonArgs);
  return commonArgs;
}

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

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const used = new Set();

function generateRandomId(length=5) {
    let id;
    do {
      const bytes = new Uint8Array(length);
      crypto.getRandomValues(bytes);
      id = [...bytes].map(b => chars[b % chars.length]).join('');
    } while (used.has(id));
    used.add(id);
//    console.log("UNIQUE ID",id);
    return id;
  };

function generateRandomId_(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

const verbose = commonArgs.verbose;
const delete_enabled = commonArgs.delete;
const purge_enabled = commonArgs.purge;

const longString = "                                                                         ";
const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];  // List of all header tags
var theRoute = [];


function clone(x){return JSON.parse(JSON.stringify(x))};
function pretty(s){return JSON.stringify(s,null,2)}
function stop(){process.exit(0)}

module.exports = {commonArgs, initCommonArgs,
  getOrdinalSuffix, formatDate, generateRandomId, 
  clone, pretty, stop};
