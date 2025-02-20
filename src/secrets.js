"use strict"
// server-side Node.js
require('dotenv').config();
const apiKey = process.env.API_KEY;
const accountId = process.env.ACCOUNT_ID;
const site_id = process.env.SITE_ID;

const  headers = {
  'content-type': 'application/json',
  'Authorization': apiKey,
  'wix-site-id':   site_id
  }

//
// some funky code that resolves a secret, 
// used to kind of simulate what WIX is doing
// but I didn't pass in the name anywhere?
// Doesn't matter because there's only one secret
//  

function getSecret(s) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(apiKey);      
    }, 2000); // Simulating a delay of 2000 milliseconds (2 seconds)
  });
}

// Usage
// asyncFunction()
//   .then((result) => {
//     console.log(result); // Output: Data successfully fetched
//   })
//   .catch((error) => {
//     console.error(error); // Output: Error fetching data
//   });



module.exports = {headers, getSecret}