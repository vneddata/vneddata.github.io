/**
 * VNEdData — Google Apps Script Web App
 * Nhận POST request từ form HTML → ghi vào Google Sheet tương ứng
 *
 * HƯỚNG DẪN CÀI ĐẶT:
 * 1. Vào script.google.com → New project → đặt tên "VNEdData Form Handler"
 * 2. Paste toàn bộ code này vào
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me (vy.phan@vneddata.org)
 *    - Who has access: Anyone
 * 4. Copy Web App URL → paste vào APPS_SCRIPT_URL trong form HTML
 */

// ── SHEET IDs ────────────────────────────────────────────────────────────────
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

    ensureHeaders(sheet, form);
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
    new Date().toISOString(),
    d.q1_bac_hoc       || '',
    d.q2_nganh         || '',
    d.q3_tan_suat      || '',
    (d.q4_cong_cu      || []).join('; '),
    (d.q5_muc_dich     || []).join('; '),
    d.q6_kiem_chung    || '',
    d.q7_tu_duy        || '',
    d.q8_huong_dan     || '',
    d.q9_ky_nang       || '',
    d.q10_mong_muon    || '',
    d.region           || '',
  ];
}

function buildTeacherRow(d) {
  return [
    new Date().toISOString(),
    d.q1_bac_day        || '',   // Bậc dạy
    d.q2_kinh_nghiem    || '',   // Kinh nghiệm
    d.q3_ai_dung        || '',   // Dùng AI chưa
    (d.q4_cong_cu       || []).join('; '), // Công cụ
    d.q5_tu_tin         || '',   // Tự tin năng lực số (1-5)
    d.q6_dao_tao        || '',   // Đã được đào tạo AI
    d.q7_ap_luc         || '',   // Áp lực nghề (1-5)
    d.q8_roi_nghe       || '',   // Nghĩ đến bỏ nghề (1-5)
    d.q9_ly_do_ap_luc   || '',   // Áp lực lớn nhất
    d.q10_lo_ngai_ai    || '',   // Rào cản ứng dụng AI
    d.q10b_mam_non      || '',   // Q11: Khả thi AI mầm non (1-5)
    d.q12_ho_tro        || '',   // Q12: Cần hỗ trợ gì (câu mở)
    d.region            || '',
  ];
}

function buildSubscriberRow(d) {
  return [
    new Date().toISOString(),
    d.email             || '',
    d.role              || '',
    (d.topics           || []).join('; '),
  ];
}

// ── HEADER MANAGEMENT ────────────────────────────────────────────────────────

function ensureHeaders(sheet, formId) {
  if (sheet.getLastRow() > 0) return; // Headers đã tồn tại

  const headers = {
    '2026-AI-V1': [
      'Timestamp','Bậc học','Ngành học','Tần suất dùng AI',
      'Công cụ AI','Mục đích dùng','Kiểm chứng (1-5)','Hỗ trợ tư duy (1-5)',
      'Hướng dẫn từ trường','Kỹ năng bị ảnh hưởng','Mong muốn từ nhà trường','Vùng miền'
    ],
    '2026-TEACHER-V1': [
      'Timestamp','Bậc dạy','Kinh nghiệm (năm)','Đã dùng AI',
      'Công cụ đang dùng','Tự tin năng lực số (1-5)','Đã được đào tạo AI',
      'Áp lực nghề (1-5)','Nghĩ đến bỏ nghề (1-5)','Áp lực lớn nhất',
      'Rào cản ứng dụng AI','Khả thi AI mầm non (1-5)','Cần hỗ trợ gì','Vùng miền'
    ],
    'SUBSCRIBERS': [
      'Timestamp','Email','Vai trò','Chủ đề quan tâm'
    ],
  };

  if (headers[formId]) {
    sheet.appendRow(headers[formId]);
    sheet.getRange(1, 1, 1, headers[formId].length)
      .setBackground('#0B1D3E')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');
  }
}

// ── TEST FUNCTIONS ────────────────────────────────────────────────────────────

function testWriteAI() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID_AI).getSheets()[0];
    ensureHeaders(sheet, '2026-AI-V1');
    sheet.appendRow([
      new Date().toISOString(),
      'Đại học', 'CNTT', 'Hàng ngày',
      'ChatGPT; Claude', 'Giải bài tập; Viết bài',
      '3', '4', 'Không có hướng dẫn',
      'Tư duy phân tích', 'TEST ROW AI', 'Asia/Ho_Chi_Minh'
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
      'THPT', '6-10 năm', 'Có, thỉnh thoảng',
      'ChatGPT; Google Gemini', '3', 'Tự học online',
      '4', '3', 'Áp lực hành chính / sổ sách',
      'Thiếu hướng dẫn', '2', 'Cần đào tạo thực hành', 'Asia/Ho_Chi_Minh'
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
