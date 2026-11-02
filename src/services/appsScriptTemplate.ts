export const APPS_SCRIPT_CODE = `/**
 * Church Discovery Survey - Google Apps Script Web App
 * Survey: Finding a Church – What Matters to You?
 * 
 * SETUP INSTRUCTIONS:
 * 1. In your Google Sheet, rename the active sheet to "Responses" (or the script will auto-create it).
 * 2. Click: Extensions > Apps Script
 * 3. Delete existing template code and paste this entire code snippet.
 * 4. Click the blue "Deploy" button (top right) > "New deployment".
 * 5. Click the gear icon next to "Select type" and choose "Web app".
 * 6. Set Description: "Church Discovery Survey Web App"
 * 7. Set Execute as: "Me" (your Google account)
 * 8. Set Who has access: "Anyone" (Required so your web app can submit responses)
 * 9. Click "Deploy", review permissions (Authorize access), and copy the Web App URL (ends in /exec).
 * 10. Paste the URL into the Church Survey App settings or VITE_GOOGLE_APPS_SCRIPT_URL.
 */

var SHEET_NAME = "Responses";

var HEADERS = [
  "Submission Date",
  "Full Name",
  "Email",
  "Phone Number",
  "Church Journey",
  "Discovery Channel",
  "Top 3 Church Expectations",
  "First Visit Expectations",
  "Reasons to Stay",
  "Preferred Communication",
  "Suggestions / Feedback",
  "Contact Consent"
];

function getOrCreateResponsesSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Initialize headers if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#F3F4F6");
    headerRange.setFontColor("#1F2937");
    sheet.setFrozenRows(1);
    
    // Auto-adjust column widths
    for (var i = 1; i <= HEADERS.length; i++) {
      sheet.setColumnWidth(i, 200);
    }
  }
  
  return sheet;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent requests to prevent row overwrites
  var hasLock = lock.tryLock(10000);
  
  try {
    var sheet = getOrCreateResponsesSheet();
    var payload;
    
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = e.parameter;
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    } else {
      payload = {};
    }
    
    var submissionDate = payload["Submission Date"] || new Date().toISOString();
    var fullName = payload["Full Name"] || "";
    var email = payload["Email"] || "";
    var phoneNumber = payload["Phone Number"] || "";
    var churchJourney = payload["Church Journey"] || "";
    var discoveryChannel = payload["Discovery Channel"] || "";
    var top3Expectations = payload["Top 3 Church Expectations"] || "";
    var firstVisitExpectations = payload["First Visit Expectations"] || "";
    var reasonsToStay = payload["Reasons to Stay"] || "";
    var preferredCommunication = payload["Preferred Communication"] || "";
    var suggestionsFeedback = payload["Suggestions / Feedback"] || "";
    var contactConsent = payload["Contact Consent"] || "No";
    
    // Append the row matching exact order of 12 fields
    var newRow = [
      submissionDate,
      fullName,
      email,
      phoneNumber,
      churchJourney,
      discoveryChannel,
      top3Expectations,
      firstVisitExpectations,
      reasonsToStay,
      preferredCommunication,
      suggestionsFeedback,
      contactConsent
    ];
    
    sheet.appendRow(newRow);
    
    var output = {
      status: "success",
      message: "Survey response saved successfully in Google Sheets.",
      row: sheet.getLastRow(),
      timestamp: new Date().toISOString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: err.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      service: "Finding a Church Survey Receiver",
      fieldsCount: HEADERS.length,
      fields: HEADERS
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
