"use strict"
const fs = require('fs').promises;
const { authorize, google } = require('./google-stuff.js');
const path = require('path');

/**
 * Look for Gmail messages from UUSE with a specific subject line
 * on a specific date.
 */
async function getGMail(params, targetDate, capture, callback) {

//const timeZone = "America/New_York"; // Your target timezone
const timeZone = "UTC"; // Your target timezone
const startOfDay = new Date(new Date(targetDate).toLocaleDateString("en-US", { timeZone }));
const endOfDay = new Date(startOfDay.getTime() + 86400000); // Add 24 hours

// Convert to Unix timestamps in UTC (divide by 1000 for seconds)
const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
const endTimestamp = Math.floor(endOfDay.getTime() / 1000);


//const todayISO = new Date(new Date(targetDate).toISOString().substring(0,10).replace(/-/g, "/"));
const options = { weekday: 'long', timeZone: "America/New_York" }; // Use 'short' for abbreviations (e.g., 'Fri')
const dayName = targetDate.toLocaleDateString('en-US', options);

console.log("Targt:",targetDate,"\nstart:",new Date(startTimestamp*1000),"\nend:  ",new Date(endTimestamp*1000));

let subject = params.subject;
let from = params.from || "eblast@uuse.ccsend.com"
  console.log("-Looking for emails on date:", dayName, new Date(startTimestamp*1000), subject, from);
  console.log(dayName, startTimestamp, endTimestamp, subject, from);

//process.exit(0);

try {
  const emails = await listEmails(startTimestamp, endTimestamp, subject, from);

  if (!emails.messages || emails.messages.length === 0) {
    console.log(`No "${subject}" emails found for the specified date.`);
    return;
  }

  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });

  // If more than one email, log details first
  if (emails.messages.length > 1) {
    console.log(`Too many (${emails.messages.length}) matching emails. Listing subjects and senders:`);

    for (const message of emails.messages) {
      const messageDetails = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });

      const headers = messageDetails.data.payload.headers;
      const subjectHeader = headers.find(h => h.name === "Subject")?.value || "(No Subject)";
      const fromHeader = headers.find(h => h.name === "From")?.value || "(No From)";
      console.log(`- Subject: ${subjectHeader}`);
      console.log(`  From: ${fromHeader}`);
    }

    throw new Error(
      `Too many (${emails.messages.length}) matching emails between ${new Date(startTimestamp * 1000)} and ${new Date(endTimestamp * 1000)} for subject "${subject}".`
    );
  }

  // Only one email — process it
  const messageId = emails.messages[0].id;
  const messageDetails = await gmail.users.messages.get({ userId: 'me', id: messageId });
  const part = messageDetails.data.payload.parts?.pop();

  if (!part) {
    console.error("No content part found in the email.");
    return;
  }

  const emailBody = Buffer.from(part.body.data, 'base64').toString('UTF-8');

  if (capture) {
    console.log("Writing email HTML to file...");
    await fs.writeFile('original.html', emailBody);
  }

  callback(emailBody);

} catch (err) {
  console.error("Error fetching emails:", err.message, err);
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
async function listEmails(startOfDay, endOfDay, subject, from) {
  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });

  console.log("email start date:",new Date(startOfDay*1000),"\nemail end date:  ",new Date(endOfDay*1000));
  
  async function makeRequest() {
    try {
      console.log("SUBJECT",subject)
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: `after:${startOfDay} before:${endOfDay} subject:"${subject}" from:${from}`,
      });
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

function stop() {process.exit(0);}

module.exports = { getGMail };