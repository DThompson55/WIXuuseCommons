"use strict"
const fs = require('fs').promises;
const { authorize, google } = require('./google-stuff.js');
const path = require('path');

/**
 * Look for Gmail messages from UUSE with a specific subject line
 * on a specific date.
 */
async function getGMail(params, targetDate, capture, callback) {

let subject = params.subject;
let from = params.from || "eblast@uuse.ccsend.com"
  console.log("Looking for emails on date:", targetDate, subject, from);

  try {
    const emails = await listEmails(targetDate, subject, from);

    if (emails.messages && emails.messages.length > 1) throw new error("Too many matching emails",targetDate,subject)

    if (emails.messages && emails.messages.length > 0) {
      const auth = await authorize();
      const gmail = google.gmail({ version: 'v1', auth });

      for (const message of emails.messages) {
        const messageDetails = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });

        const subjectLine = messageDetails.data.payload.headers.find(obj => obj.name === "Subject");
        console.log("Email Subject Line:", subjectLine.value);

        const part = messageDetails.data.payload.parts?.pop(); // Safely access parts array
        if (!part) {
          console.error("No content part found in the email.");
          continue;
        }

        const emailBody = Buffer.from(part.body.data, 'base64').toString('UTF-8');

        if (capture) {
          console.log("Writing email HTML to file...");
          await fs.writeFile('original.html', emailBody);
        }
        callback(emailBody);
      }
    } else {
      console.log(`No "${subject}" emails found for the specified date.`);
    }
  } catch (err) {
    console.error("Error fetching emails:", err.message,err);
  }
}

const TOKEN_PATH = path.join(path.dirname(process.cwd()), 'token.json');

/**
 * Delete the saved token if it exists.
 */
async function deleteToken() {
  try {
    await fs.unlink(TOKEN_PATH);
    console.log('Deleted expired token.');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Failed to delete token:', err.message);
    }
  }
}

/**
 * List Gmail messages based on the date and subject filter.
 * @param {string} emailSentDate - Date string (e.g., '2024-12-28').
 * @param {string} subject - Subject filter for the email.
 * @return {Promise<Object>} The list of emails.
 */
async function listEmails(emailSentDate, subject, from) {
  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });

  // Convert emailSentDate to timestamps
  const startOfDay = Math.floor(new Date(emailSentDate).setHours(0, 0, 0, 0) / 1000);
  const endOfDay = startOfDay + 86400; // Add 24 hours for next day

  async function makeRequest() {
    try {

      console.log("SUBJECT",subject,"Day",emailSentDate,startOfDay,endOfDay)

      const response = await gmail.users.messages.list({
        userId: 'me',
        q: `after:${startOfDay} before:${endOfDay} from, subject:${subject}`,
      });
//      console.log(response.data)
      return response.data;
    } catch (err) {
      if (err.code === 401) {
        console.error('Token expired. Re-authenticating...');
        await deleteToken();
        const newAuth = await authorize();
        const newGmail = google.gmail({ version: 'v1', auth: newAuth });
        return newGmail.users.messages.list({
          userId: 'me',
          q: `after:${startOfDay} before:${endOfDay} from:eblast@uuse.ccsend.com subject:${subject}`,
        });
      }
      throw err;
    }
  }

  return makeRequest();
}

module.exports = { listEmails, getGMail };