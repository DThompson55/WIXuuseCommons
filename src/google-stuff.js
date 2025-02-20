"use strict"
const fs = require('fs').promises;
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const path = require('path');

// Get the parent directory of the current working directory
const BASE_PATH = path.dirname(process.cwd());

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(BASE_PATH, 'token.json');
const CREDENTIALS_PATH = path.join(BASE_PATH, 'credentials.json');

console.log("Base Path:", BASE_PATH);
console.log("Credentials Path:", CREDENTIALS_PATH);
console.log("Token Path:", TOKEN_PATH);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    console.error('Failed to load saved credentials:', err.message);
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 */
async function saveCredentials(client) {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    }, null, 2);  // Pretty-print for easier debugging

    await fs.writeFile(TOKEN_PATH, payload);
    console.log('Credentials saved successfully.');
  } catch (err) {
    console.error('Failed to save credentials:', err.message);
  }
}

/**
 * Load or request authorization to call APIs.
 *
 * @return {Promise<OAuth2Client>}
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    console.log('Loaded existing credentials.');
    return client;
  }

  try {
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    console.log('Successfully authenticated.');

    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  } catch (err) {
    console.error('Authorization failed:', err.message);
    throw err;  // Ensure errors bubble up for handling elsewhere
  }
}

// Optional: Initialize the flow for testing
async function init() {
  try {
    await authorize();
    console.log('Authorization complete.');
  } catch (err) {
    console.error('Initialization failed:', err.message);
  }
}

// Uncomment if running this file directly
// init();

module.exports = { authorize, google };