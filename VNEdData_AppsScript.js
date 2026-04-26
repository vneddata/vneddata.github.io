/**
 * VNEdData — Google Apps Script Web App
 * Nhận POST request từ form HTML → ghi vào Google Sheet tương ứng
 *
 * HƯỚNG DẪN CÀI ĐẶT:
 * 1. Vào script.google.com → New project → đặt tên "VNEdData Form Handler"
 * 2. Paste toàn bộ code này vào
 * 3. Thay SHEET_ID_AI và SHEET_ID_TEACHER bằng ID thật từ Google Drive URL
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me (vneddata@gmail.com)
 *    - Who has access: Anyone
 * 5. Copy Web App URL → paste vào config.js (APPS_SCRIPT_URL)
 */

// ── SHEET IDs ────────────────────────────────────────────────────────────────
// Lấy từ URL Google Sheet: docs.google.com/spreadsheets/d/[SHEET_ID]/edit
const SHEET_ID_AI      = '1n0ZfCrS2dPlY8hoiFWndE9EthMiDeioJx52g7iTSwPs'; // 2026-AI-V1
const SHEET_ID_TEACHER = '1P6fdEoX-v543nhNR_xnrKAIDaeEMRYDWu4CWOPOs6w8';                   // 2026-TEACHER-V1 (tạo mới)
const SHEET_ID_SUBS    = '1X-4Wf82q9xstQn_9JtVo_p__RnbD09GX5FHLcWcGr-I'; // Subscribers

// ── CORS HEADERS ──────────────────────────────────────────────────────────────
function setCORSHeaders(output) {
  return output
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── HANDLE OPTIONS (preflight) ────────────────────────────────────────────────
function doOptions() {
  return setCORSHeaders(
    ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
  );
}

// ── MAIN HANDLER ──────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const form = data.form_id;
    let sheet, row;

    if (form === '2026-AI-V1') {
      sheet = SpreadsheetApp.openById(SHEET_ID_AI).getSheetByName('Responses') 
           || SpreadsheetApp.openById(SHEET_ID_AI).getSheets()[0];
      row = buildAIRow(data);

    } else if (form === '2026-TEACHER-V1') {
      sheet = SpreadsheetApp.openById(SHEET_ID_TEACHER).getSheetByName('Responses')
           || SpreadsheetApp.openById(SHEET_ID_TEACHER).getSheets()[0];
      row = buildTeacherRow(data);

    } else if (form === 'SUBSCRIBERS') {
      sheet = SpreadsheetApp.openById(SHEET_ID_SUBS).getSheets()[0];
      row = buildSubscriberRow(data);

    } else {
      throw new Error('Unknown form_id: ' + form);
    }

    // Ensure header row exists
    ensureHeaders(sheet, form);

    // Append data
    sheet.appendRow(row);

    return setCORSHeaders(
      ContentService.createTextOutput(JSON.stringify({ status: 'ok', rows: sheet.getLastRow() }))
        .setMimeType(ContentService.MimeType.JSON)
    );

  } catch (err) {
    return setCORSHeaders(
      ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
        .setMimeType(ContentService.MimeType.JSON)
    );
  }
}

// ── ROW BUILDERS ──────────────────────────────────────────────────────────────

function buildAIRow(d) {
  return [
    new Date().toISOString(),       // Timestamp
    d.q1_bac_hoc      || '',        // Bậc học
    d.q2_nganh        || '',        // Ngành học
    d.q3_tan_suat     || '',        // Tần suất dùng AI
    (d.q4_cong_cu     || []).join('; '), // Công cụ AI (array)
    (d.q5_muc_dich    || []).join('; '), // Mục đích dùng (array)
    d.q6_kiem_chung   || '',        // Kiểm chứng thông tin (1-5)
    d.q7_tu_duy       || '',        // Hỗ trợ tư duy (1-5)
    d.q8_huong_dan    || '',        // Trường có hướng dẫn
    d.q9_ky_nang      || '',        // Kỹ năng bị ảnh hưởng
    d.q10_mong_muon   || '',        // Mong muốn từ nhà trường
    d.region          || '',        // Vùng miền (tự detect)
  ];
}

function buildTeacherRow(d) {
  return [
    new Date().toISOString(),
    d.q1_bac_day      || '',        // Bậc dạy
    d.q2_mon_day      || '',        // Môn dạy
    d.q3_kinh_nghiem  || '',        // Số năm kinh nghiệm
    d.q4_ai_biet      || '',        // Biết về AI
    d.q5_ai_dung      || '',        // Đã dùng AI trong dạy học
    (d.q6_cong_cu     || []).join('; '), // Công cụ đang dùng
    d.q7_tu_tin       || '',        // Tự tin về năng lực số (1-5)
    d.q8_dao_tao      || '',        // Đã được đào tạo AI chưa
    d.q9_ap_luc       || '',        // Mức độ áp lực nghề (1-5)
    d.q10_roi_nghe    || '',        // Có nghĩ đến bỏ nghề không
    d.q11_ho_tro      || '',        // Cần hỗ trợ gì
    d.q12_open        || '',        // Câu mở
    d.region          || '',
  ];
}

function buildSubscriberRow(d) {
  return [
    new Date().toISOString(),
    d.email           || '',
    d.role            || '',
    (d.topics         || []).join('; '),
  ];
}

// ── HEADER MANAGEMENT ────────────────────────────────────────────────────────

function ensureHeaders(sheet, formId) {
  if (sheet.getLastRow() > 0) return; // Headers already exist

  const headers = {
    '2026-AI-V1': [
      'Timestamp','Bậc học','Ngành học','Tần suất dùng AI',
      'Công cụ AI','Mục đích dùng','Kiểm chứng (1-5)','Hỗ trợ tư duy (1-5)',
      'Hướng dẫn từ trường','Kỹ năng bị ảnh hưởng','Mong muốn từ nhà trường','Vùng miền'
    ],
    '2026-TEACHER-V1': [
      'Timestamp','Bậc dạy','Môn dạy','Kinh nghiệm (năm)',
      'Biết về AI','Đã dùng AI','Công cụ đang dùng','Tự tin năng lực số (1-5)',
      'Đã được đào tạo AI','Áp lực nghề (1-5)','Nghĩ đến bỏ nghề','Cần hỗ trợ gì','Ý kiến mở','Vùng miền'
    ],
    'SUBSCRIBERS': ['Timestamp','Email','Vai trò','Chủ đề quan tâm'],
  };

  if (headers[formId]) {
    sheet.appendRow(headers[formId]);
    sheet.getRange(1, 1, 1, headers[formId].length)
      .setBackground('#0B1D3E')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');
  }
}

// ── TEST FUNCTION (chạy thủ công để test) ────────────────────────────────────
function testAISubmission() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        form_id: '2026-AI-V1',
        q1_bac_hoc: 'Đại học',
        q2_nganh: 'CNTT / Kỹ thuật số',
        q3_tan_suat: 'Hàng ngày',
        q4_cong_cu: ['ChatGPT', 'Claude'],
        q5_muc_dich: ['Giải bài tập', 'Viết bài'],
        q6_kiem_chung: '3',
        q7_tu_duy: '4',
        q8_huong_dan: 'Không có hướng dẫn',
        q9_ky_nang: 'Tư duy phân tích',
        q10_mong_muon: 'Hướng dẫn cụ thể cách dùng AI có trách nhiệm',
        region: 'TP.HCM',
      })
    }
  };
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
