/**
 * VNEdData — data.js
 * ══════════════════════════════════════════════════════════════
 * NGUỒN DỮ LIỆU TRUNG TÂM — Single Source of Truth
 * Mọi thông tin hiển thị trên website đều đọc từ file này.
 *
 * CÁCH CẬP NHẬT:
 * 1. Chỉnh sửa file này
 * 2. Lưu → git commit → git push
 * 3. Website tự động cập nhật tất cả trang liên quan
 *
 * Cập nhật lần cuối: Tháng 4/2026
 * Phiên bản: 1.0
 * ══════════════════════════════════════════════════════════════
 */

const VNEDDATA = {

  // ════════════════════════════════════════════════════════════
  // 1. CẤU HÌNH HỆ THỐNG — Thay đổi khi rebrand hoặc đổi tài khoản
  // ════════════════════════════════════════════════════════════
  config: {
    name:       "VNEdData",
    nameHtml:   "<span class='vned'>VNEd</span><span class='data'>Data</span>",
    tagline:    "Dữ liệu Giáo dục Việt Nam",
    taglineFull:"Dữ liệu giáo dục độc lập · Khoa học · Minh bạch · Bền vững",
    founded:    "2026",
    email:      "vneddata@gmail.com",
    github:     "https://github.com/vneddata/vneddata",
    website:    "https://vneddata.github.io",
    version:    "1.0",
    lastUpdated:"2026-04",

    // Màu sắc brand (dùng cho JS-rendered elements)
    colors: {
      navy:   "#0B1D3E",
      blue:   "#0F3460",
      teal:   "#148F77",
      gold:   "#C8841A",
      white:  "#FFFFFF",
      cream:  "#FEFCF9",
    },

    // Google services — cập nhật khi có form/sheet/dashboard mới
    googleForms: {
      ai2026:     "https://forms.gle/PLACEHOLDER_AI_2026",     // ← Thay bằng link thật
      teacher2026:"https://forms.gle/PLACEHOLDER_TEACHER_2026",
      parent2026: "https://forms.gle/PLACEHOLDER_PARENT_2026",
      infra2026:  "https://forms.gle/PLACEHOLDER_INFRA_2026",
    },
    googleSheets: {
      ai2026:     "https://docs.google.com/spreadsheets/d/PLACEHOLDER", // ← Sheet lưu responses
    },
    lookerStudio: {
      ai2026:     "",  // ← Dán embed URL Looker Studio vào đây khi có
    },
  },

  // ════════════════════════════════════════════════════════════
  // 2. THỐNG KÊ TỔNG QUAN — Cập nhật thủ công hàng tháng
  //    (Tự động hóa sau khi kết nối Google Sheets API)
  // ════════════════════════════════════════════════════════════
  stats: {
    totalResponses:   0,      // ← Cập nhật sau mỗi đợt thu thập
    totalSurveys:     1,      // ← Số khảo sát đang/đã chạy
    totalProvinces:   0,      // ← Số tỉnh/thành có phản hồi
    activeSurveys:    1,      // ← Số đang mở
    targetResponses:  500,    // ← Mục tiêu đợt đầu
    lastSyncDate:     "2026-04-22",
  },

  // ════════════════════════════════════════════════════════════
  // 3. DANH SÁCH KHẢO SÁT — Cập nhật khi thêm/đóng/mở khảo sát
  //    ⚠️  Đây là nơi DUY NHẤT khai báo khảo sát
  //    Thay đổi ở đây → tự động cập nhật: trang chủ, surveys, reports, open data
  // ════════════════════════════════════════════════════════════
  surveys: [
    {
      id:          "2026-AI-V1",
      code:        "AI",
      version:     1,
      year:        2026,
      title:       "AI trong Học tập — Thực trạng 2026",
      titleShort:  "AI trong Học tập 2026",
      description: "Khảo sát toàn diện về mức độ sử dụng, nhận thức và tác động của AI đối với học sinh, sinh viên Việt Nam.",
      descriptionLong: "Khảo sát đầu tiên của VNEdData, tập trung vào thực trạng sử dụng công cụ AI (ChatGPT, Gemini, Claude...) trong học tập, mức độ nhận thức về hallucination và rủi ro AI, tác động đến kỹ năng tư duy độc lập, và thái độ đạo đức học thuật.",
      icon:        "🤖",
      iconBg:      "#E8F5F2",
      status:      "open",         // "open" | "upcoming" | "closed"
      statusLabel: "Đang mở",
      statusColor: "#D5F5E3",
      statusTextColor: "#117a65",
      openDate:    "2026-04-01",
      closeDate:   null,            // null = chưa đặt ngày đóng
      targetDate:  null,
      audience:    "Mọi bậc học",
      duration:    "~8 phút",
      anonymous:   true,
      questions:   10,
      targetN:     500,
      currentN:    0,              // ← Cập nhật hàng tuần
      file:        "khaosat_thidiem_1truong.html",
      formUrl:     null,           // ← Điền Google Forms URL khi có
      sheetsUrl:   null,
      lookerUrl:   null,
      topics:      ["AI", "Học tập", "Nhận thức", "Đạo đức học thuật"],
      dataAvailable: false,        // true khi có CSV để download
      dataUrl:     null,
    },
    {
      id:          "2026-TEACHER-V1",
      code:        "TEACHER",
      version:     1,
      year:        2026,
      title:       "Giáo viên & Chuyển đổi số 2026",
      titleShort:  "Giáo viên & AI 2026",
      description: "Năng lực số, thái độ với AI và nhu cầu hỗ trợ của đội ngũ giáo viên phổ thông và đại học Việt Nam.",
      icon:        "👨‍🏫",
      iconBg:      "#EBF5FB",
      status:      "upcoming",
      statusLabel: "Sắp mở",
      openDate:    null,
      closeDate:   null,
      targetDate:  "2026-07-01",
      audience:    "Giáo viên · Giảng viên",
      duration:    "~10 phút",
      anonymous:   true,
      questions:   12,
      targetN:     300,
      currentN:    0,
      file:        null,
      formUrl:     null,
      topics:      ["Giáo viên", "Năng lực số", "AI", "Đào tạo"],
      dataAvailable: false,
      dataUrl:     null,
    },
    {
      id:          "2026-PARENT-V1",
      code:        "PARENT",
      version:     1,
      year:        2026,
      title:       "Phụ huynh & Kỳ vọng Giáo dục",
      titleShort:  "Phụ huynh 2026",
      description: "Quan điểm, lo ngại và kỳ vọng của phụ huynh về chất lượng giáo dục và vai trò của công nghệ.",
      icon:        "👨‍👩‍👧",
      iconBg:      "#FEF3CD",
      status:      "upcoming",
      statusLabel: "Sắp mở",
      openDate:    null,
      closeDate:   null,
      targetDate:  "2026-09-01",
      audience:    "Phụ huynh học sinh",
      duration:    "~6 phút",
      anonymous:   true,
      questions:   8,
      targetN:     400,
      currentN:    0,
      file:        null,
      formUrl:     null,
      topics:      ["Phụ huynh", "Kỳ vọng", "Chất lượng giáo dục"],
      dataAvailable: false,
      dataUrl:     null,
    },
    {
      id:          "2026-INFRA-V1",
      code:        "INFRA",
      version:     1,
      year:        2026,
      title:       "Hạ tầng số Trường học Việt Nam",
      titleShort:  "Hạ tầng số 2026",
      description: "Thực trạng trang thiết bị số, kết nối internet và ứng dụng CNTT tại trường học.",
      icon:        "🏫",
      iconBg:      "#F2EFFF",
      status:      "upcoming",
      statusLabel: "Sắp mở",
      openDate:    null,
      closeDate:   null,
      targetDate:  "2026-11-01",
      audience:    "Cán bộ quản lý trường",
      duration:    "~7 phút",
      anonymous:   true,
      questions:   10,
      targetN:     200,
      currentN:    0,
      file:        null,
      formUrl:     null,
      topics:      ["Hạ tầng số", "CNTT", "Trường học"],
      dataAvailable: false,
      dataUrl:     null,
    },
  ],

  // ════════════════════════════════════════════════════════════
  // 4. BÁO CÁO — Thêm vào khi có báo cáo mới được xuất bản
  // ════════════════════════════════════════════════════════════
  reports: [
    {
      id:          "2026-AI-PRELIMINARY",
      surveyId:    "2026-AI-V1",
      title:       "AI trong Học tập Việt Nam: Báo cáo Sơ bộ 2026",
      titleShort:  "AI Report 2026 (Sơ bộ)",
      type:        "preliminary",   // "preliminary" | "full" | "annual" | "policy_brief"
      typeLabel:   "Báo cáo Sơ bộ",
      status:      "collecting",    // "collecting" | "draft" | "published"
      publishDate: null,
      description: "Kết quả sơ bộ từ khảo sát 2026-AI-V1. Cập nhật liên tục khi có dữ liệu mới.",
      tag:         "Đang thu thập",
      tagType:     "sync",          // "sync" | "teal" | "gold"
      downloadUrl: null,
      lookerUrl:   null,
      keyFindings: [],              // ← Điền sau khi có đủ dữ liệu
    },
    {
      id:          "2026-ANNUAL",
      surveyId:    null,
      title:       "Báo cáo Thường niên Giáo dục Việt Nam 2026",
      titleShort:  "Báo cáo Thường niên 2026",
      type:        "annual",
      typeLabel:   "Thường niên",
      status:      "planned",
      publishDate: "2026-12-01",
      description: "Bức tranh tổng hợp về giáo dục Việt Nam năm 2026.",
      tag:         "Kế hoạch · T12/2026",
      tagType:     "teal",
      downloadUrl: null,
      lookerUrl:   null,
      keyFindings: [],
    },
    {
      id:          "2026-POLICY-AI",
      surveyId:    "2026-AI-V1",
      title:       "Policy Brief: AI & Học thuật Toàn vẹn — Khuyến nghị cho Bộ GD&ĐT",
      titleShort:  "Policy Brief: AI & Học thuật",
      type:        "policy_brief",
      typeLabel:   "Policy Brief",
      status:      "planned",
      publishDate: "2026-08-01",
      description: "Khuyến nghị chính sách dành cho Bộ GD&ĐT về AI trong giáo dục.",
      tag:         "Kế hoạch · T8/2026",
      tagType:     "gold",
      downloadUrl: null,
      lookerUrl:   null,
      keyFindings: [],
    },
  ],

  // ════════════════════════════════════════════════════════════
  // 5. DATASET MỞ — Thêm khi có dữ liệu ẩn danh để công bố
  // ════════════════════════════════════════════════════════════
  datasets: [
    {
      id:          "2026-AI-V1-ANON",
      surveyId:    "2026-AI-V1",
      title:       "2026-AI-V1 Dataset Ẩn danh",
      description: "Dữ liệu khảo sát AI trong Học tập · Cập nhật liên tục",
      formats:     ["CSV"],
      license:     "CC BY 4.0",
      available:   false,           // true khi có dữ liệu để tải
      downloadUrl: null,
      size:        null,
      lastUpdated: null,
    },
    {
      id:          "QUESTIONNAIRE-V1",
      surveyId:    null,
      title:       "Bộ câu hỏi Chuẩn VNEdData v1.0",
      description: "Template cho 6 chủ đề khảo sát giáo dục · Kèm Codebook",
      formats:     ["PDF"],
      license:     "CC BY 4.0",
      available:   true,
      downloadUrl: "mailto:vneddata@gmail.com",  // Liên hệ để nhận
      size:        null,
      lastUpdated: "2026-04",
    },
  ],

  // ════════════════════════════════════════════════════════════
  // 6. CHUỖI SỰ KIỆN / MILESTONES — Cập nhật hàng quý
  // ════════════════════════════════════════════════════════════
  milestones: [
    {
      date:   "2026-04",
      title:  "Thành lập VNEdData",
      desc:   "Công bố tuyên ngôn sứ mệnh, tài liệu vận hành v1.0, ra mắt website",
      status: "done",
      type:   "founding",
    },
    {
      date:   "2026-04",
      title:  "Khảo sát AI 2026 (2026-AI-V1) mở",
      desc:   "Đợt thu thập dữ liệu đầu tiên. Mục tiêu 500 phản hồi.",
      status: "active",
      type:   "survey",
    },
    {
      date:   "2026-07",
      title:  "Ra mắt Khảo sát Giáo viên",
      desc:   "Mở rộng sang đối tượng giáo viên/giảng viên toàn quốc.",
      status: "planned",
      type:   "survey",
    },
    {
      date:   "2026-08",
      title:  "Công bố Policy Brief đầu tiên",
      desc:   "Gửi khuyến nghị AI & Học thuật Toàn vẹn đến Bộ GD&ĐT.",
      status: "planned",
      type:   "publication",
    },
    {
      date:   "2026-12",
      title:  "Báo cáo Thường niên 2026",
      desc:   "Báo cáo tổng hợp năm đầu tiên. Công bố mở.",
      status: "planned",
      type:   "publication",
    },
    {
      date:   "2027",
      title:  "Mở rộng mạng lưới đối tác",
      desc:   "Kết nối 5+ trường, xin phê duyệt IRB, hợp tác nghiên cứu.",
      status: "future",
      type:   "growth",
    },
  ],

  // ════════════════════════════════════════════════════════════
  // 7. GIÁ TRỊ CỐT LÕI — Hiếm khi thay đổi
  // ════════════════════════════════════════════════════════════
  coreValues: [
    {
      icon: "🔬",
      title: "Khoa học",
      desc: "Mọi kết quả dựa trên phương pháp nghiên cứu chuẩn quốc tế, không chịu áp lực chính trị hay thương mại.",
    },
    {
      icon: "📂",
      title: "Minh bạch",
      desc: "Dữ liệu thô ẩn danh được công bố mở. Phương pháp ghi lại đầy đủ. Changelog công khai.",
    },
    {
      icon: "🛡️",
      title: "Độc lập",
      desc: "Không nhận tài trợ có điều kiện. Không có lợi ích thương mại. Kết quả báo cáo trung thực.",
    },
    {
      icon: "🔒",
      title: "Bảo vệ",
      desc: "Ẩn danh tuyệt đối. Informed consent rõ ràng. Quyền rút lui không điều kiện.",
    },
    {
      icon: "🎯",
      title: "Tác động thực",
      desc: "Mọi nghiên cứu kết thúc bằng đề xuất hành động. Dữ liệu trình bày để mọi người hiểu được.",
    },
  ],

  // ════════════════════════════════════════════════════════════
  // 8. ETHICS COMMITMENTS — Gần như không thay đổi
  // ════════════════════════════════════════════════════════════
  ethicsCommitments: [
    "Không thu thập tên, email, số điện thoại hay bất kỳ thông tin định danh nào",
    "Địa chỉ IP không được ghi nhận hay lưu trữ",
    "Dữ liệu chỉ được sử dụng cho mục đích nghiên cứu học thuật",
    "Không bán, không chia sẻ, không thương mại hóa dữ liệu",
    "Người tham gia có quyền rút lui bất kỳ lúc nào",
    "Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân",
  ],

};

// ── HELPER FUNCTIONS — Tiện ích để JS trong index.html dùng ───────────────

/** Lấy khảo sát theo trạng thái */
VNEDDATA.getSurveysByStatus = function(status) {
  return this.surveys.filter(s => s.status === status);
};

/** Lấy báo cáo theo survey ID */
VNEDDATA.getReportsBySurvey = function(surveyId) {
  return this.reports.filter(r => r.surveyId === surveyId);
};

/** Tổng phản hồi từ tất cả khảo sát */
VNEDDATA.getTotalResponses = function() {
  return this.surveys.reduce((sum, s) => sum + (s.currentN || 0), 0);
};

/** Cập nhật n responses cho 1 khảo sát (dùng với live data) */
VNEDDATA.updateResponses = function(surveyId, n) {
  const s = this.surveys.find(s => s.id === surveyId);
  if (s) s.currentN = n;
};

// Đánh dấu đã load xong
window.VNEDDATA_LOADED = true;
console.log('[VNEdData] data.js loaded — version', VNEDDATA.config.version,
  '|', VNEDDATA.surveys.length, 'surveys |',
  VNEDDATA.getSurveysByStatus('open').length, 'open');
