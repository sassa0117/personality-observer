/**
 * Personality Observer - Google Drive Sync
 *
 * 【セットアップ手順】
 * 1. Google Apps Script (https://script.google.com) で新しいプロジェクトを作成
 * 2. このコードを貼り付け
 * 3. 「デプロイ」→「新しいデプロイ」
 * 4. 種類:「ウェブアプリ」を選択
 * 5. アクセスできるユーザー:「自分のみ」
 * 6. デプロイ → URLをコピー
 * 7. HTML側の「Google Drive設定」にそのURLを貼り付け
 */

const FILE_NAME = 'personality-observer-data.json';

// データ取得
function doGet(e) {
  try {
    const file = findFile();
    if (!file) {
      return jsonResponse({ success: true, data: [] });
    }
    const content = file.getBlob().getDataAsString();
    const data = JSON.parse(content);
    return jsonResponse({ success: true, data: data });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// データ保存
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const data = body.data;
    if (!Array.isArray(data)) {
      return jsonResponse({ success: false, error: 'data must be an array' });
    }

    const json = JSON.stringify(data, null, 2);
    const file = findFile();

    if (file) {
      file.setContent(json);
    } else {
      DriveApp.createFile(FILE_NAME, json, MimeType.PLAIN_TEXT);
    }

    return jsonResponse({ success: true, count: data.length });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function findFile() {
  const files = DriveApp.getFilesByName(FILE_NAME);
  return files.hasNext() ? files.next() : null;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
