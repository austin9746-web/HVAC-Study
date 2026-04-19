// ============================================================
// HVAC Study Hub — Google Apps Script (Leaderboard + Cloud Sync)
// ============================================================
// SETUP:
// 1. Go to https://script.google.com
// 2. Click "New project"
// 3. Delete everything and paste this entire file
// 4. Click "Deploy" → "New deployment"
// 5. Type = "Web app", Execute as = "Me", Access = "Anyone"
// 6. Click "Deploy" and copy the URL
// 7. Paste the URL into your index.html where it says SCRIPT_URL
// ============================================================

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'leaderboard';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'leaderboard') {
    return getLeaderboard(getOrCreateSheet(ss, 'Scores'));
  }
  
  if (action === 'sync_load') {
    var username = e.parameter.username || '';
    return loadProgress(getOrCreateSheet(ss, 'Progress'), username);
  }
  
  return jsonResponse({error: 'Unknown action'});
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (data.action === 'submit_score') {
      return submitScore(getOrCreateSheet(ss, 'Scores'), data);
    }
    
    if (data.action === 'sync_save') {
      return saveProgress(getOrCreateSheet(ss, 'Progress'), data);
    }
    
    return jsonResponse({error: 'Unknown action'});
  } catch(err) {
    return jsonResponse({error: err.message});
  }
}

// === HELPER ===
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === 'Scores') {
      sheet.appendRow(['Username', 'Tool', 'Correct', 'Wrong', 'Total', 'Percentage', 'Points', 'MaxPoints', 'Date']);
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    }
    if (name === 'Progress') {
      sheet.appendRow(['Username', 'Tool', 'StatsJSON', 'SessionJSON', 'Updated']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
  }
  return sheet;
}

// === CLOUD SYNC ===
function saveProgress(sheet, data) {
  if (!data.username || !data.tool) return jsonResponse({error: 'Missing username or tool'});
  
  var rows = sheet.getDataRange().getValues();
  var found = -1;
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.username && rows[i][1] === data.tool) {
      found = i + 1; // 1-indexed row
      break;
    }
  }
  
  var statsStr = data.stats ? JSON.stringify(data.stats) : '{}';
  var sessionStr = data.session ? JSON.stringify(data.session) : '';
  var now = new Date().toISOString();
  
  if (found > 0) {
    // Update existing row
    sheet.getRange(found, 3).setValue(statsStr);
    sheet.getRange(found, 4).setValue(sessionStr);
    sheet.getRange(found, 5).setValue(now);
  } else {
    // New row
    sheet.appendRow([data.username, data.tool, statsStr, sessionStr, now]);
  }
  
  return jsonResponse({success: true});
}

function loadProgress(sheet, username) {
  if (!username) return jsonResponse({error: 'Missing username'});
  
  var rows = sheet.getDataRange().getValues();
  var result = {};
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === username) {
      var tool = rows[i][1];
      var stats = {};
      var session = null;
      try { stats = JSON.parse(rows[i][2] || '{}'); } catch(e) {}
      try { if (rows[i][3]) session = JSON.parse(rows[i][3]); } catch(e) {}
      result[tool] = { stats: stats, session: session, updated: rows[i][4] };
    }
  }
  
  return jsonResponse({progress: result});
}

// === LEADERBOARD ===
function submitScore(sheet, data) {
  if (!data.username || !data.tool || data.correct === undefined || data.total === undefined) {
    return jsonResponse({error: 'Missing fields'});
  }
  
  var pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
  
  sheet.appendRow([
    data.username,
    data.tool,
    data.correct || 0,
    data.wrong || 0,
    data.total || 0,
    pct,
    data.points || 0,
    data.maxPoints || 0,
    new Date().toISOString()
  ]);
  
  return jsonResponse({success: true});
}

function getLeaderboard(sheet) {
  if (sheet.getLastRow() <= 1) {
    return jsonResponse({leaderboard: [], recent: []});
  }
  
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
  var users = {};
  var recent = [];
  
  data.forEach(function(row) {
    var username = row[0];
    var correct = Number(row[2]) || 0;
    var wrong = Number(row[3]) || 0;
    var total = Number(row[4]) || 0;
    var points = Number(row[6]) || 0;
    
    if (!users[username]) {
      users[username] = { username: username, totalCorrect: 0, totalWrong: 0, attempts: 0 };
    }
    users[username].totalCorrect += correct;
    users[username].totalWrong += wrong;
    users[username].attempts++;
    
    var pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    recent.push({ username: username, tool: row[1], correct: correct, total: total, pct: pct, date: row[8] });
  });
  
  recent.sort(function(a, b) { return b.date > a.date ? 1 : -1; });
  recent = recent.slice(0, 20);
  
  var leaderboard = [];
  for (var u in users) {
    var user = users[u];
    user.accuracy = user.totalCorrect + user.totalWrong > 0
      ? Math.round((user.totalCorrect / (user.totalCorrect + user.totalWrong)) * 100) : 0;
    leaderboard.push(user);
  }
  leaderboard.sort(function(a, b) {
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
    return b.totalCorrect - a.totalCorrect;
  });
  
  return jsonResponse({leaderboard: leaderboard, recent: recent});
}

function test() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Sheets: ' + ss.getSheets().map(function(s){return s.getName();}).join(', '));
}
