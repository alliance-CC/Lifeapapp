/**
 * ============================================================
 * ライフアップ専用アプリ — Google スプレッドシート バックエンド
 * ============================================================
 *
 * 【セットアップ手順】
 * 1. Googleスプレッドシートを新規作成
 * 2. 拡張機能 > Apps Script を開く
 * 3. このコードをすべて貼り付けて保存
 * 4. 「プロジェクトの設定 > スクリプト プロパティ」で
 *      キー: API_SECRET   値: 任意の長いランダム文字列（Next.js側と一致させる）
 *    を追加
 * 5. 「デプロイ > 新しいデプロイ > 種類: ウェブアプリ」
 *      実行ユーザー: 自分
 *      アクセスできるユーザー: 全員
 *    でデプロイし、表示される「ウェブアプリのURL」をコピー
 * 6. Next.js の環境変数に設定:
 *      SHEETS_API_URL    = コピーしたウェブアプリURL
 *      SHEETS_API_SECRET = 手順4で設定したのと同じ文字列
 * ============================================================
 */

// --- 各シート（タブ）の定義 ---------------------------------
var SHEETS = {
  users:   ['id', 'name', 'email', 'passwordHash', 'role', 'department', 'job_type', 'avatar_url', 'level', 'experience', 'created_at'],
  reports: ['id', 'userId', 'userName', 'date', 'good', 'bad', 'badCause', 'aiAdvice', 'expEarned', 'created_at'],
  thanks:  ['id', 'fromUserId', 'fromName', 'toUserId', 'toName', 'category', 'message', 'points', 'created_at'],
  cases:   ['id', 'userId', 'userName', 'category', 'title', 'content', 'result', 'created_at']
};

function getSecret() {
  return PropertiesService.getScriptProperties().getProperty('API_SECRET') || '';
}

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(SHEETS[name]);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(SHEETS[name]);
  }
  return sheet;
}

function readAll(name) {
  var sheet = getSheet(name);
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) obj[headers[j]] = values[i][j];
    rows.push(obj);
  }
  return rows;
}

function appendRow(name, obj) {
  var sheet = getSheet(name);
  var headers = SHEETS[name];
  var row = headers.map(function (h) { return obj[h] !== undefined ? obj[h] : ''; });
  sheet.appendRow(row);
  return obj;
}

function uuid() {
  return Utilities.getUuid();
}

function nowIso() {
  return new Date().toISOString();
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- ユーザー（hashを含まない安全な形）-----------------------
function safeUser(u) {
  return {
    id: u.id, name: u.name, email: u.email, role: u.role,
    department: u.department, job_type: u.job_type, avatar_url: u.avatar_url,
    level: u.level, experience: u.experience, created_at: u.created_at
  };
}

// --- メインエンドポイント ------------------------------------
function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
    if (req.secret !== getSecret()) {
      return json({ error: 'unauthorized' });
    }

    var action = req.action;
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var result = handleAction(action, req);
      return json(result);
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json({ error: String(err) });
  }
}

function handleAction(action, req) {
  switch (action) {

    case 'signup': {
      var users = readAll('users');
      var exists = users.some(function (u) {
        return String(u.email).toLowerCase() === String(req.email).toLowerCase();
      });
      if (exists) return { error: 'このメールアドレスは既に登録されています' };

      var role = users.length === 0 ? 'manager' : 'general';
      var user = {
        id: uuid(), name: req.name || '', email: req.email,
        passwordHash: req.passwordHash, role: role,
        department: req.department || '', job_type: req.job_type || '',
        avatar_url: '', level: 1, experience: 0, created_at: nowIso()
      };
      appendRow('users', user);
      return { user: safeUser(user) };
    }

    case 'getUserByEmail': {
      var all = readAll('users');
      var found = null;
      for (var i = 0; i < all.length; i++) {
        if (String(all[i].email).toLowerCase() === String(req.email).toLowerCase()) {
          found = all[i]; break;
        }
      }
      if (!found) return { user: null };
      // パスワード照合のため passwordHash も返す（サーバー間通信のみ）
      return { user: found };
    }

    case 'getUserById': {
      var list = readAll('users');
      var u = list.filter(function (x) { return x.id === req.userId; })[0];
      return { user: u ? safeUser(u) : null };
    }

    case 'listUsers': {
      return { users: readAll('users').map(safeUser) };
    }

    case 'updateRole': {
      var sheet = getSheet('users');
      var data = sheet.getDataRange().getValues();
      var idCol = SHEETS.users.indexOf('id');
      var roleCol = SHEETS.users.indexOf('role');

      // 最後の管理者を降格させない安全チェック
      if (req.newRole !== 'manager') {
        var mgrCount = 0, targetIsMgr = false;
        for (var r = 1; r < data.length; r++) {
          if (data[r][roleCol] === 'manager') mgrCount++;
          if (data[r][idCol] === req.userId && data[r][roleCol] === 'manager') targetIsMgr = true;
        }
        if (targetIsMgr && mgrCount <= 1) {
          return { error: '最後の管理者アカウントの権限は変更できません' };
        }
      }

      for (var k = 1; k < data.length; k++) {
        if (data[k][idCol] === req.userId) {
          sheet.getRange(k + 1, roleCol + 1).setValue(req.newRole);
          return { success: true };
        }
      }
      return { error: 'ユーザーが見つかりません' };
    }

    case 'addReport': {
      var report = {
        id: uuid(), userId: req.userId || '', userName: req.userName || '',
        date: req.date || nowIso().slice(0, 10), good: req.good || '',
        bad: req.bad || '', badCause: req.badCause || '',
        aiAdvice: req.aiAdvice || '', expEarned: req.expEarned || 50,
        created_at: nowIso()
      };
      appendRow('reports', report);
      addExp(req.userId, report.expEarned);
      return { report: report };
    }

    case 'listReports': {
      var reports = readAll('reports');
      if (req.userId) reports = reports.filter(function (r) { return r.userId === req.userId; });
      reports.sort(function (a, b) { return String(b.created_at).localeCompare(String(a.created_at)); });
      return { reports: reports };
    }

    case 'addThanks': {
      var t = {
        id: uuid(), fromUserId: req.fromUserId || '', fromName: req.fromName || '',
        toUserId: req.toUserId || '', toName: req.toName || '',
        category: req.category || '', message: req.message || '',
        points: req.points || 0, created_at: nowIso()
      };
      appendRow('thanks', t);
      if (req.toUserId) addExp(req.toUserId, Number(req.points) || 0);
      return { thanks: t };
    }

    case 'listThanks': {
      var th = readAll('thanks');
      th.sort(function (a, b) { return String(b.created_at).localeCompare(String(a.created_at)); });
      return { thanks: th };
    }

    case 'addCase': {
      var c = {
        id: uuid(), userId: req.userId || '', userName: req.userName || '',
        category: req.category || '', title: req.title || '',
        content: req.content || '', result: req.result || '',
        created_at: nowIso()
      };
      appendRow('cases', c);
      addExp(req.userId, 100);
      return { case: c };
    }

    case 'listCases': {
      var cs = readAll('cases');
      cs.sort(function (a, b) { return String(b.created_at).localeCompare(String(a.created_at)); });
      return { cases: cs };
    }

    case 'ranking': {
      var ranked = readAll('users').map(safeUser);
      ranked.sort(function (a, b) { return (Number(b.experience) || 0) - (Number(a.experience) || 0); });
      return { ranking: ranked };
    }

    default:
      return { error: 'unknown action: ' + action };
  }
}

// 経験値を加算
function addExp(userId, amount) {
  if (!userId || !amount) return;
  var sheet = getSheet('users');
  var data = sheet.getDataRange().getValues();
  var idCol = SHEETS.users.indexOf('id');
  var expCol = SHEETS.users.indexOf('experience');
  var lvCol = SHEETS.users.indexOf('level');
  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === userId) {
      var newExp = (Number(data[i][expCol]) || 0) + Number(amount);
      sheet.getRange(i + 1, expCol + 1).setValue(newExp);
      sheet.getRange(i + 1, lvCol + 1).setValue(Math.floor(newExp / 100) + 1);
      return;
    }
  }
}

// 動作確認用
function doGet() {
  return json({ ok: true, app: 'LifeUp Sheets Backend' });
}
