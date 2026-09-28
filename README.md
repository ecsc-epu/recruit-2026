# EPU Cybersecurity Club (ECSC) — Tuyển mem đợt 2 · 2026

Một trang duy nhất, không cuộn: collage kiểu bìa mixtape (keygen 1998 × space-rainbow × horrorcore),
3D bằng three.js, nhạc **Unreal Super Hero 3** (Kenet & Rez) và một **flag hunt 10 mảnh**.

## Chạy thử

```bash
cd website
python3 -m http.server 8000     # rồi mở http://localhost:8000
```

Mở thẳng `index.html` (double-click) cũng chạy, nhưng hiệu ứng nhảy theo nhạc sẽ dùng nhịp BPM
thay vì phân tích âm thanh thật (trình duyệt chặn đọc file âm thanh qua `file://`).
Cần Internet cho three.js (tải từ CDN jsDelivr). Font đã được đóng gói sẵn trong `assets/fonts/`.

## Sửa nội dung → chỉ cần `config.js`

| Muốn đổi | Sửa trong `config.js` |
|---|---|
| Tên CLB, tiêu đề, chữ đỏ "TUYỂN MEM", hạn chót | `club`, `title`, `recruit`, `dateLine`, `deadline` |
| Google Form nhận đăng ký (keygen gửi thẳng vào form) | `form` |
| Các track (sao hồng + băng cassette) | `tracks` |
| Lịch (mặt B của băng) | `dates` |
| Lời thoại + gợi ý của ông hải tặc | `pirate` |
| Flag hunt | `ctf` (xem ghi chú của ban tổ chức) |
| Link Facebook / Discord / Email | `links` |
| Logo, ảnh CLB trong banner keygen | `logo`, `photo` (bỏ ảnh vào `assets/img/`) |
| Nhạc | `music.src` (bỏ file vào `assets/audio/`) |

Bố cục (vị trí từng mảnh collage) nằm ở `css/style.css`, tính theo toạ độ của một "artboard"
1600×900 (ngang) hoặc 900×1600 (dọc). Artboard được thu phóng vừa màn hình nên không cần media query.
Vị trí các vật thể 3D nằm ở `COMPO` đầu file `js/scene.js`, cùng hệ toạ độ đó.

## Flag hunt

Có 10 mảnh flag giấu trong trang. Ghép đủ rồi dán vào ô **License Key** của keygen. Chúc may mắn ☠

## Cấu trúc

```
website/
├── index.html          khung trang (ít khi phải sửa)
├── config.js           ← toàn bộ nội dung
├── css/style.css       giao diện + bố cục artboard
├── js/core.js          namespace, event bus, tiện ích
├── js/audio.js         nhạc, bắt nhịp, hiệu ứng âm thanh chiptune
├── js/ctf.js           flag hunt
├── js/collage.js       collage 2D: ông hải tặc, keygen, sticker kéo được, máu
├── js/scene.js         thế giới 3D + hậu kỳ chia đôi 1998 / 2026
├── js/main.js          màn intro (cracktro), vòng lặp chính
├── assets/audio/       unreal-superhero-3.mp3 (+ file module .xm gốc)
└── assets/fonts/       font woff2 (css/fonts.css)
```

## Hiệu năng

Trang tự giảm chất lượng nếu máy chậm (dưới ~40 fps): trước là độ phân giải, sau đó tắt bloom.

## Đăng ký qua Google Form

Bấm ACTIVATE là keygen gửi thẳng tên, MSSV, email, SĐT và mảng quan tâm vào Google Form trong `form`
(không cần server, chạy được trên GitHub Pages). Nếu gửi lỗi, form sẽ tự mở ra với câu trả lời đã điền sẵn.

- Nếu đổi câu hỏi trong form, cập nhật lại `form.fields` (mã `entry.…` của từng câu) và `form.tracks`.
  `form.tracks` phải trùng y hệt các lựa chọn của câu "Mảng bạn quan tâm".
- Không bật "Chỉ cho phép 1 câu trả lời" hay "Yêu cầu đăng nhập" trong Google Form, vì khi đó form bắt
  đăng nhập Google và keygen không gửi thẳng được nữa.

## Đưa lên mạng (GitHub Pages)

1. Tạo repo mới trên GitHub (ví dụ `ecsc-recruit`) và đưa **nội dung thư mục `website/`** lên nhánh `main`.
   Đừng đưa `ADMIN-NOTES.md` (đáp án flag) hay thư mục `media/`: repo GitHub Pages miễn phí là repo công khai.
2. Repo → Settings → Pages → Build and deployment: chọn "Deploy from a branch", nhánh `main`, thư mục `/ (root)`.
3. Vài phút sau trang chạy ở `https://<tên-github>.github.io/ecsc-recruit/`.

## Credits

- Nhạc: *Unreal Superhero 3* — Kenet & Rez (1994/2001), bản module gốc từ The Mod Archive #149252,
  render ra mp3 bằng libopenmpt.
- 3D: three.js 0.170 (jsDelivr). Font: Anton, Nosifer, Patrick Hand, Press Start 2P, Space Mono, VT323 (Google Fonts, SIL OFL, đóng gói trong `assets/fonts/`).
- Mọi hình 3D (mặt trời, sọ, tim voxel, sao, cầu vồng) đều dựng bằng code, không dùng model ngoài.
# recruit-2026
