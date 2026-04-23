# VNEdData — Dữ liệu Giáo dục Việt Nam

> Hệ thống thu thập, phân tích và công bố dữ liệu độc lập về giáo dục Việt Nam  
> **Khoa học · Minh bạch · Bền vững**

📧 vneddata@gmail.com

---

## Cấu trúc repo

```
vneddata/
│
├── index.html                      # Website chính (Single Page App)
├── data.js                         # ⭐ Nguồn dữ liệu trung tâm
│
├── khaosat_thidiem_1truong.html    # Khảo sát AI 2026 — 10 câu, ~4 phút
│
├── VNEdData_Logo_Canva.svg         # Logo SVG (nền trong suốt)
├── VNEdData_Logo_Canva.png         # Logo PNG (1563×1563px)
│
└── README.md                       # File này
```

---

## Cách cập nhật website

### Thêm khảo sát mới
Mở `data.js` → thêm object vào mảng `surveys[]`:
```js
{
  id:          "2026-TEACHER-V1",
  title:       "Giáo viên & Chuyển đổi số 2026",
  status:      "open",       // "open" | "upcoming" | "closed"
  targetDate:  "2026-07-01",
  file:        "khaosat_giaovien_2026.html",
  // ...
}
```

### Đóng/mở khảo sát
```js
// Trong surveys[], tìm đúng survey và đổi:
status: "open"  →  status: "closed"
```

### Thêm báo cáo mới
Mở `data.js` → thêm vào mảng `reports[]`

### Cập nhật số phản hồi
```js
// Trong surveys[], tìm đúng survey:
currentN: 247,   // ← cập nhật con số thực
```

### Kết nối Looker Studio dashboard
```js
// Trong config.lookerStudio:
ai2026: "https://lookerstudio.google.com/embed/reporting/XXXX",
```

---

## Deploy

Website chạy trên **GitHub Pages** — tự động deploy khi push vào `main`.

```bash
git add .
git commit -m "Update: [mô tả thay đổi]"
git push origin main
# Website cập nhật sau ~1 phút
```

**URL:** `https://[username].github.io/vneddata`

---

## Kiến trúc đồng bộ

```
data.js (nguồn duy nhất)
    │
    ├── index.html đọc khi load → render tất cả trang
    │       ├── Trang chủ (stats, survey list, reports preview)
    │       ├── Trang Khảo sát (danh sách, trạng thái)
    │       ├── Trang Báo cáo (progress bar, Looker embed)
    │       ├── Trang Dữ liệu mở (dataset list)
    │       └── Trang Về chúng tôi (values, milestones)
    │
    └── Survey files đọc localStorage → index.html đọc stats
            khaosat_thidiem_1truong.html → ai_edu_responses_v1
```

---

## Dữ liệu

Tất cả dataset ẩn danh được công bố theo **CC BY 4.0** — tự do sử dụng với điều kiện ghi nguồn:

```
VNEdData. (2026). [Tên khảo sát] [Dataset]. vneddata@gmail.com
```

---

## Tài liệu nội bộ (lưu trên Google Drive)

| File | Mô tả |
|------|-------|
| VNEdData_TaiLieuVanHanh_v1.docx | Tuyên ngôn sứ mệnh, giá trị cốt lõi, quy trình vận hành |
| AI_GiaoDuc_VietNam.docx | Phân tích AI & Giáo dục Việt Nam (nền tảng lý thuyết) |
| HeThong_ThuThap_DuLieu_AI.docx | Phương pháp luận hệ thống thu thập dữ liệu |
| LoTrinh_6Thang_ThuThapDuLieu.docx | Kế hoạch triển khai 6 tháng |

---

*© 2026 VNEdData · Tài liệu mở · CC BY 4.0*
