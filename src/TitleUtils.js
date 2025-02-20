"use strict"
 // Helper to clean and normalize titles
const cleanTitle = (title) => title ? title.replace(/[\s\p{P}-]+$/u, '').toLowerCase().trim() : null;

// Handle special case for "Yoga"
const normalizeTitle = (title) => {
  let cleaned = cleanTitle(title);
  if (cleaned === "yoga") cleaned= "yoga at the meetinghouse"
  if (cleaned === "science & religion") cleaned= "science and religion discussion group"
  if (cleaned === "science and religion") cleaned= "science and religion discussion group"
  return cleaned;
};


module.exports = {cleanTitle, normalizeTitle}