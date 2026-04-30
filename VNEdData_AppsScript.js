/**
 * VNEdData — Google Apps Script Web App
 * Nhận POST request từ form HTML → ghi vào Google Sheet tương ứng
 *
 * HƯỚNG DẪN CÀI ĐẶT:
 * 1. Vào script.google.com → New project → đặt tên "VNEdData Form Handler"
 * 2. Paste toàn bộ code này vào
 * 3. Thay SHEET_ID_AI và SHEET_ID_TEACHER bằng ID thật từ Google Drive URL
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me (vy.phan@vneddata.org)
 *    - Who has access: Anyone
 * 5. Copy Web App URL → paste vào config.js (APPS_SCRIPT_URL)
 */

// ── SHEET IDs ────────────────────────────────────────────────────────────────
// Lấy từ URL Google Sheet: docs.google.com/spreadsheets/d/[SHEET_ID]/edit
const SHEET_ID_AI      = '1XMIbNlzBNWGEa0oxtflFX8nzCQDcaILnXqZimsUfxrE'; // 2026-AI-V1
const SHEET_ID_TEACHER = '1gBQ7zNx888hSZ6rYgkZ69bfD-s14HIEP9bvaapfruWM'; // 2026-TEACHER-V1
const SHEET_ID_SUBS    = '1H_llzLQztg7pr5Duc2qRokoA9ZJMcxsQZxNnVPWFZsU'; // Subscribers

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
      sheet = SpreadsheetApp.openById(SHEET_ID_AI).getSheets()[0];
      row = buildAIRow(data);

    } else if (form === '2026-TEACHER-V1') {
      sheet = SpreadsheetApp.openById(SHEET_ID_TEACHER).getSheets()[0];
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
    d.q3_tan_suat     || '',        // Tần suất dùng AI (30 ngày qua)
    (d.q4_cong_cu     || []).join('; '), // Công cụ AI (array)
    (d.q5_muc_dich    || []).join('; '), // Mục đích dùng (array)
    d.q6_kiem_chung   || '',        // Kiểm tra nguồn khác (1=Rất hiếm→5=Luôn luôn)
    d.q7_tu_duy       || '',        // Cách dùng AI (Radio: gợi ý/cấu trúc/sửa/viết hộ/tra cứu)
    d.q8_huong_dan    || '',        // Trường có hướng dẫn
    d.q9_ky_nang      || '',        // Kỹ năng thay đổi rõ rệt nhất
    d.q10_khu_vuc     || '',        // Khu vực địa lý (NEW)
    d.q11_mong_muon   || '',        // Mong muốn từ nhà trường
    d.region          || '',        // Timezone (tự detect)
  ];
}

function buildTeacherRow(d) {
  return [
    new Date().toISOString(),
    d.q1_bac_day        || '',      // Bậc dạy
    d.q2_kinh_nghiem    || '',      // Số năm kinh nghiệm
    d.q3_ai_dung        || '',      // Đã dùng AI trong dạy học
    (d.q4_cong_cu       || []).join('; '), // Công cụ đang dùng
    d.q5_tu_tin         || '',      // Tự tin năng lực số (1-5)
    d.q6_dao_tao        || '',      // Đã được đào tạo AI chưa
    d.q7_ap_luc         || '',      // Áp lực nghề (1-5)
    d.q8_roi_nghe       || '',      // Nghĩ đến bỏ nghề
    d.q9_ly_do_ap_luc   || '',      // Lý do áp lực chính
    d.q10_lo_ngai_ai    || '',      // Rào cản ứng dụng AI (updated)
    d.q10b_mam_non      || '',      // Khả thi AI mầm non (NEW, 1-5)
    d.q12_ho_tro        || '',      // Cần hỗ trợ gì (Q11→Q12)
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
      'Timestamp','Bậc dạy','Kinh nghiệm (năm)','Đã dùng AI',
      'Công cụ đang dùng','Tự tin năng lực số (1-5)','Đã được đào tạo AI',
      'Áp lực nghề (1-5)','Nghĩ đến bỏ nghề','Lý do áp lực','Lo ngại về AI','Cần hỗ trợ gì','Vùng miền'
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

// ── TEST FUNCTIONS (không dùng ContentService — chạy được trong editor) ──────
function testWriteAI() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID_AI).getSheets()[0];
    ensureHeaders(sheet, '2026-AI-V1');
    sheet.appendRow([
      new Date().toISOString(),
      'Đại học', 'CNTT', 'Hàng ngày',
      'ChatGPT; Claude', 'Giải bài tập',
      '3', '4', 'Không có hướng dẫn',
      'Tư duy phân tích', 'TEST ROW', 'Asia/Ho_Chi_Minh'
    ]);
    Logger.log('✅ AI sheet OK — rows: ' + sheet.getLastRow());
  } catch(e) { Logger.log('❌ ' + e.message); }
}

function testWriteTeacher() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID_TEACHER).getSheets()[0];
    ensureHeaders(sheet, '2026-TEACHER-V1');
    sheet.appendRow([
      new Date().toISOString(),
      'THPT', '6-10 năm', 'Vài lần/tuần',
      'ChatGPT', '3', 'Tự học',
      '4', 'Có nghĩ nhưng tiếp tục',
      'Lương thấp', 'HS lạm dụng AI', '', 'Asia/Ho_Chi_Minh'
    ]);
    Logger.log('✅ Teacher sheet OK — rows: ' + sheet.getLastRow());
  } catch(e) { Logger.log('❌ ' + e.message); }
}

function testWriteSubs() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID_SUBS).getSheets()[0];
    ensureHeaders(sheet, 'SUBSCRIBERS');
    sheet.appendRow([new Date().toISOString(), 'test@vneddata.org', 'researcher', 'dataset']);
    Logger.log('✅ Subscribers sheet OK — rows: ' + sheet.getLastRow());
  } catch(e) { Logger.log('❌ ' + e.message); }
}
