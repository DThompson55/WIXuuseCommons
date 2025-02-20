"use strict"
function extractFutureDate(str) {
  try{
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based index for months

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstLine = str.split('\n')[0] || '';  // Get the first line or an empty string
  
  const dateRegex = new RegExp(
      `(?:Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)?,?\\s*` +  // Optional day of the week
      `(${monthNames.join("|")})\\s*(\\d{1,2})`,  // Month and day
      "i"
      );

  const match = firstLine.match(dateRegex);

  if (match) {
    const month = monthNames.findIndex(
      m => m.toLowerCase() === match[1].toLowerCase()
      );
    const day = parseInt(match[2], 10);

    let extractedDate = new Date(currentYear, month, day);

    // If the target month is within the next 6 months and we're at the end of the year
    if (month < currentMonth - 2) {
      extractedDate.setFullYear(currentYear + 1);
    }

    // If the target month is within the last 2 months and we're at the start of the year
    if (month > currentMonth + 6) {
      extractedDate.setFullYear(currentYear - 1);
    }

    return extractedDate;
  }
} catch(err){
  console.log("String Was:"+str,"Error was:",err);
  return null;
}
//  console.log("No Date Was Found");  
  return null;  // Return null if no date is found
}

function getNextSunday(date) {
  // Ensure the input is a Date object
  const givenDate = new Date(date);
  
  // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDay = givenDate.getDay();
  
  // Calculate the number of days to add to reach the next Sunday
  const daysToAdd = (7 - currentDay) % 7 || 7;
  
  // Add the calculated number of days to the given date
  const nextSunday = new Date(givenDate);
  nextSunday.setDate(givenDate.getDate() + daysToAdd);
  
  return nextSunday;
}
function pretty(s){return JSON.stringify(s,null,2)}
function stop(){process.exit(0)}

module.exports = {extractFutureDate, getNextSunday}