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
| Link form đăng ký (+ tự điền tên/MSSV/email/SĐT/flag) | `applyUrl`, `applyPrefill` |
| Các track (sao hồng + băng cassette) | `tracks` |
| Lịch (mặt B của băng) | `dates` |
| Lời thoại + gợi ý của ông hải tặc | `pirate` |
| Flag và chỗ giấu từng mảnh | `ctf` |
| Link Facebook / Discord / Email | `links` |
| Logo, ảnh CLB trong banner keygen | `logo`, `photo` (bỏ ảnh vào `assets/img/`) |
| Nhạc | `music.src` (bỏ file vào `assets/audio/`) |

Bố cục (vị trí từng mảnh collage) nằm ở `css/style.css`, tính theo toạ độ của một "artboard"
1600×900 (ngang) hoặc 900×1600 (dọc). Artboard được thu phóng vừa màn hình nên không cần media query.
Vị trí các vật thể 3D nằm ở `COMPO` đầu file `js/scene.js`, cùng hệ toạ độ đó.

## Flag hunt

- 10 mảnh, flag bắt đầu bằng `ECSC{`. Người chơi ghép theo thứ tự 1 → 10 rồi dán vào ô **License Key** của keygen.
- Có 3 loại mảnh:
  - **mảnh chữ**: tìm bằng cách tương tác với trang. Trong `config.js` chúng được mã hoá (XOR + base64).
  - **mảnh DevTools**: comment HTML, Console, Local Storage.
  - **mảnh hình**: chỉ tồn tại dưới dạng điểm ảnh, không có ở dạng chữ trong code, nên
    view-source hay Ctrl+F đều không thấy. Có 3 cái: tim voxel nổ ra thành chữ, chữ viết sau gáy
    ông mặt trời, và chữ chỉ hiện trong thế giới 1998.
- Keygen kiểm tra flag bằng SHA-256, nên trong code không có flag.
- `ctf.where` trong `config.js` quy định mảnh nào nằm ở đâu.
- Ông hải tặc là "người dẫn chuyện" duy nhất. Click vào ông để nhận gợi ý cho mảnh còn thiếu.
- Tiến độ được nhớ trong trình duyệt của từng người (localStorage).
- Đổi flag: mở trang → F12 → Console →
  `EPU.ctf.encode(["ECSC{", "…", …], { 2: 5, 6: 4, 7: 4 })`, rồi dán kết quả vào `ctf` trong `config.js`.
  Tham số thứ hai đánh dấu mảnh hình (số mảnh: số ký tự mỗi dòng). Mảnh chỉ dùng ký tự ASCII, mảnh của tim tối đa 4 ký tự.
- Muốn biết ai giải được: đặt `applyPrefill.flag` là id một câu hỏi trong Google Form. Keygen chỉ gửi flag khi flag đúng.

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

## Đưa lên mạng

Đây là web tĩnh: kéo thả thư mục `website/` lên Netlify Drop, GitHub Pages, Cloudflare Pages…

## Credits

- Nhạc: *Unreal Superhero 3* — Kenet & Rez (1994/2001), bản module gốc từ The Mod Archive #149252,
  render ra mp3 bằng libopenmpt.
- 3D: three.js 0.170 (jsDelivr). Font: Anton, Nosifer, Patrick Hand, Press Start 2P, Space Mono, VT323 (Google Fonts, SIL OFL, đóng gói trong `assets/fonts/`).
- Mọi hình 3D (mặt trời, sọ, tim voxel, sao, cầu vồng) đều dựng bằng code, không dùng model ngoài.
# recruit-2026
