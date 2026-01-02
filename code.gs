const SPREADSHEET_ID = "1GPDsOXLWdLhlFcDYRGhMgLOwS4p3PfgyjxZyOxS5bLs"; 

function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Scores') || ss.insertSheet('Scores');

  if (action === 'getLeaderboard') {
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return response([]);
    data.shift(); 
    data.sort(function(a, b) { return b[2] - a[2]; });
    return response(data.slice(0, 10));
  }

  if (action === 'saveScore') {
    var name = e.parameter.name || "無名氏";
    var score = e.parameter.score || 0;
    if (sheet.getLastRow() === 0) sheet.appendRow(['ID', 'Name', 'Score', 'Date']);
    sheet.appendRow([Utilities.getUuid(), name, parseInt(score), new Date().toLocaleString()]);
    return response({status: "success"});
  }

  if (action === 'update') {
    var id = e.parameter.id;
    var newName = e.parameter.newName;
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] === id) {
        sheet.getRange(i + 1, 2).setValue(newName);
        return response({status: "updated"});
      }
    }
  }

  if (action === 'delete') {
    var id = e.parameter.id;
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] === id) {
        sheet.deleteRow(i + 1);
        return response({status: "deleted"});
      }
    }
  }
}

function response(content) {
  return ContentService.createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) { return doGet(e); }
