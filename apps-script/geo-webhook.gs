// apps-script/geo-webhook.gs
// Google Apps Script — deploy from your Google Sheet as a Web App.
// Execution: Me. Access: Anyone (even anonymous).
//
// Receives POST requests from geo plugin skills and appends or updates
// rows in the correct tab in this sheet.
//
// Supported actions (payload.action):
//   appendRow  — default; appends payload.row to the tab (legacy behavior)
//   updateRow  — finds the row where matchColumn === matchValue and writes
//                updateValue into updateColumn. Creates the column if missing.

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = payload.action || 'appendRow';

    // Get or create the target tab
    var tab = ss.getSheetByName(payload.tab);
    if (!tab) {
      tab = ss.insertSheet(payload.tab);
      // Write headers if provided and tab is brand-new
      if (payload.headers && payload.headers.length > 0) {
        tab.appendRow(payload.headers);
      }
    }

    if (action === 'updateRow') {
      return doUpdateRow(tab, payload);
    }

    // Default: appendRow
    tab.appendRow(payload.row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', tab: payload.tab }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Finds the row where payload.matchColumn === payload.matchValue and sets
// payload.updateColumn = payload.updateValue. Appends the column header if
// it does not already exist. Returns { status, tab, row } on success.
function doUpdateRow(tab, payload) {
  var data = tab.getDataRange().getValues();
  var headers = data[0];

  // Locate the match column
  var matchColIdx = headers.indexOf(payload.matchColumn);
  if (matchColIdx === -1) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'matchColumn "' + payload.matchColumn + '" not found in headers'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Find the first row where matchColumn === matchValue
  var targetRowIdx = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][matchColIdx]) === String(payload.matchValue)) {
      targetRowIdx = i;
      break;
    }
  }
  if (targetRowIdx === -1) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'No row found where "' + payload.matchColumn + '" === "' + payload.matchValue + '"'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Find or create the update column
  var updateColIdx = headers.indexOf(payload.updateColumn);
  if (updateColIdx === -1) {
    // Column doesn't exist yet — append it to the header row
    updateColIdx = headers.length;
    tab.getRange(1, updateColIdx + 1).setValue(payload.updateColumn);
  }

  // Write the value (getRange is 1-indexed; data array is 0-indexed)
  tab.getRange(targetRowIdx + 1, updateColIdx + 1).setValue(payload.updateValue);

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      tab: payload.tab,
      row: targetRowIdx + 1
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Serves a sheet tab as JSON (or JSONP) for external reading use cases.
// Supports ?tab=TabName to specify which tab to read (defaults to first tab).
// Supports ?callback=fnName for JSONP, which bypasses browser CORS restrictions
// caused by the Apps Script redirect chain.
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tabName = e && e.parameter && e.parameter.tab;
    var tab = tabName ? ss.getSheetByName(tabName) : ss.getSheets()[0];
    var json;

    if (!tab) {
      json = JSON.stringify({ status: 'ok', data: [] });
    } else {
      var raw = tab.getDataRange().getValues();
      if (raw.length < 2) {
        json = JSON.stringify({ status: 'ok', data: [] });
      } else {
        var headers = raw[0];
        var rows = [];
        for (var i = 1; i < raw.length; i++) {
          var row = {};
          for (var j = 0; j < headers.length; j++) {
            row[headers[j]] = raw[i][j];
          }
          rows.push(row);
        }
        json = JSON.stringify({ status: 'ok', data: rows });
      }
    }

    // JSONP: if ?callback=fnName is provided, wrap in the callback
    var callback = e && e.parameter && e.parameter.callback;
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + json + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService
      .createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    var errJson = JSON.stringify({ status: 'error', message: err.toString() });
    var callback = e && e.parameter && e.parameter.callback;
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + errJson + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService
      .createTextOutput(errJson)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Smoke test — run manually from the Apps Script editor to verify the script works.
// Creates a "Test" tab, appends a row, then updates it via doUpdateRow.
function smokeTest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tab = ss.getSheetByName('Test') || ss.insertSheet('Test');
  tab.clearContents();

  // Test appendRow
  tab.appendRow(['URL', 'Score', 'Recommended Changes']);
  tab.appendRow(['https://example.com/test', '6', '']);

  // Test updateRow
  doUpdateRow(tab, {
    tab: 'Test',
    matchColumn: 'URL',
    matchValue: 'https://example.com/test',
    updateColumn: 'Recommended Changes',
    updateValue: 'https://docs.google.com/document/d/smoke-test-doc-id'
  });

  Logger.log('Smoke test passed.');
}
