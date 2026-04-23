/**
 * VNEdData — config.js
 * ══════════════════════════════════════════════════════════════
 * CẤU HÌNH HỆ THỐNG — Tách riêng để dễ cập nhật
 *
 * ĐÂY LÀ FILE BẠN CẦN CẬP NHẬT KHI:
 *   • Tạo Google Form mới → điền URL vào googleForms
 *   • Tạo Google Sheet mới → điền URL vào googleSheets
 *   • Tạo Looker Studio dashboard → điền embed URL vào lookerStudio
 *   • Đổi domain → cập nhật website
 *
 * SAU KHI CHỈNH SỬA:
 *   git add config.js → git commit → git push
 *   Website tự cập nhật sau ~1 phút
 *
 * Cập nhật lần cuối: Tháng 4/2026
 * ══════════════════════════════════════════════════════════════
 */

const VNEDCONFIG = {

  // ── THÔNG TIN DỰ ÁN ─────────────────────────────────────────
  project: {
    name:        "VNEdData",
    tagline:     "Dữ liệu Giáo dục Việt Nam",
    taglineFull: "Dữ liệu giáo dục độc lập · Khoa học · Minh bạch · Bền vững",
    founder:     "Phan Lê Ngọc Vy",
    founderTitle:"Nghiên cứu sinh Tiến sĩ Giáo dục, Đại học Edgewood, Hoa Kỳ",
    email:       "vneddata@gmail.com",
    website:     "https://vneddata.github.io",
    github:      "https://github.com/vneddata/vneddata",
    founded:     "2026",
    version:     "1.0",
  },

  // ── MÀU SẮC BRAND ────────────────────────────────────────────
  // Dùng cho JS-rendered elements. Không đổi trừ khi rebrand.
  colors: {
    navy:   "#0B1D3E",
    blue:   "#0F3460",
    teal:   "#148F77",
    green:  "#209D5C",   // Màu xanh lá thực trong logo Canva
    gold:   "#C8841A",
    white:  "#FFFFFF",
    cream:  "#FEFCF9",
  },

  // ── GOOGLE FORMS ─────────────────────────────────────────────
  // Điền link Google Form sau khi tạo xong
  // Hướng dẫn: forms.google.com → Tạo form → Gửi → Sao chép link
  googleForms: {
    ai2026:      https://forms.gle/hPyn53bUALkYYbRAA,   // ← ĐIỀN VÀO: link khảo sát 2026-AI-V1
    teacher2026: null,   // ← ĐIỀN VÀO: link khảo sát 2026-TEACHER-V1
    parent2026:  null,   // ← ĐIỀN VÀO: link khảo sát 2026-PARENT-V1
    infra2026:   null,   // ← ĐIỀN VÀO: link khảo sát 2026-INFRA-V1
  },

  // ── GOOGLE SHEETS ─────────────────────────────────────────────
  // Mỗi Form tự động tạo 1 Sheet khi có response đầu tiên
  // Hoặc: trong Form → Responses tab → tạo Spreadsheet
  // Link Sheet: mở Sheet → copy URL trên thanh địa chỉ
  googleSheets: {
    ai2026:      null,   // ← ĐIỀN VÀO: link Google Sheet của 2026-AI-V1
    teacher2026: null,
    parent2026:  null,
    infra2026:   null,
  },

  // ── LOOKER STUDIO EMBED ───────────────────────────────────────
  // Sau khi tạo dashboard trên Looker Studio:
  // File → Embed report → Bật "Enable embedding" → Copy iframe src URL
  // Chỉ lấy phần URL trong src="...", không lấy cả thẻ <iframe>
  lookerStudio: {
    ai2026:      null,   // ← ĐIỀN VÀO: embed URL từ Looker Studio
    teacher2026: null,
    parent2026:  null,
    infra2026:   null,
  },

  // ── TRẠNG THÁI KẾT NỐI ────────────────────────────────────────
  // Hệ thống tự đọc và hiển thị trạng thái trên website
  connectionStatus: {
    googleForms:   false,  // ← Đổi thành true khi đã tạo và điền link Forms
    googleSheets:  false,  // ← Đổi thành true khi đã tạo Sheets và có dữ liệu
    lookerStudio:  false,  // ← Đổi thành true khi đã embed dashboard
  },

};

// ── HELPER: Lấy link survey cho từng khảo sát ────────────────────
VNEDCONFIG.getSurveyLink = function(surveyCode) {
  const key = surveyCode.toLowerCase().replace(/-v\d+$/, '').replace('2026-', '') + '2026';
  return this.googleForms[key] || null;
};

// ── HELPER: Lấy Looker embed URL ─────────────────────────────────
VNEDCONFIG.getLookerEmbed = function(surveyCode) {
  const key = surveyCode.toLowerCase().replace(/-v\d+$/, '').replace('2026-', '') + '2026';
  return this.lookerStudio[key] || null;
};

// Đánh dấu đã load
window.VNEDCONFIG_LOADED = true;
console.log('[VNEdData] config.js loaded —',
  'Forms:', Object.values(VNEDCONFIG.googleForms).filter(Boolean).length + '/4 connected',
  '| Sheets:', Object.values(VNEDCONFIG.googleSheets).filter(Boolean).length + '/4 connected',
  '| Looker:', Object.values(VNEDCONFIG.lookerStudio).filter(Boolean).length + '/4 connected'
);
