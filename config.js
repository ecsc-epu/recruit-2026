/* ==========================================================================
   EPU CYBERSECURITY CLUB — SITE CONFIG
   Edit THIS file to update the site. Save, then refresh the browser.
   It's a plain JavaScript object: keep "quotes" around text and commas
   between items. Lines starting with // are notes and can be deleted.
   ========================================================================== */
window.SITE = {

  /* ---------- identity ---------- */
  club: "EPU Cybersecurity Club",
  short: "ECSC",                 // the only abbreviation used anywhere; otherwise write the full name

  // Big chrome title. One entry per line; the text is stretched to fill the space.
  title: {
    landscape: ["EPU CYBERSECURITY CLUB"],
    portrait: ["EPU CYBER", "SECURITY CLUB"]
  },

  // The big bloody text in the middle
  recruit: { big: "TUYỂN MEM", small: "ĐỢT 2 · 2026" },

  // Top-right line under the title
  dateLine: "HẠN CHÓT 20.11 · 23:59",

  /* ---------- joining: ACTIVATE in the keygen sends the answers straight into this Google Form ----------
     If sending fails (offline…), the form opens in a new tab, pre-filled, so nobody gets lost.
     `fields` = which question each keygen field fills. To find the ids: open the form,
     ⋮ → "Get pre-filled link", fill anything, copy the link and read the "entry.123…" parts.
     `email: "emailAddress"` is the form's own "collect email addresses" box (responder input).
     `note` (optional question): a correct flag is written there as "FLAG: ECSC{…}". */
  form: {
    url: "https://forms.gle/8MTUuPABRM52jE7w8",
    action: "https://docs.google.com/forms/d/e/1FAIpQLSf0qerHp3-DiokUK6sKMXJNHXZIOfAqEI5kMaE9_7ag_oQwQw/formResponse",
    fields: {
      name: "entry.26795268",
      id: "entry.936298709",
      phone: "entry.1653163342",
      email: "emailAddress",
      track: "entry.660730388",
      note: "entry.201262861"
    },
    // must be exactly the choices of the "Mảng bạn quan tâm" question
    tracks: ["Web Exploit", "Binary Exploit", "RE", "Cryptography", "Forensics"]
  },
  deadline: "2026-11-20T23:59:00+07:00",          // countdown ("TRIAL EXPIRES IN")

  /* ---------- soundtrack (sound is required: the intro waits for a key press) ----------
     The mp3 was rendered from the original tracker module (assets/audio/unreal_superhero_3.xm,
     The Mod Archive #149252). To use another song, drop a file in assets/audio and change `src`. */
  music: {
    src: "assets/audio/unreal-superhero-3.mp3",
    title: "Unreal Super Hero 3",
    artist: "Kenet & Rez",
    bpm: 128,            // visuals fall back to this tempo when the audio can't be analysed
    volume: 0.75,
    // used only if the file above is missing:
    soundcloudUrl: "https://soundcloud.com/demoscenemusic/unreal-superhero-3"
  },

  /* ---------- tracks: each one is a pink star orbiting the smiley + a line on the tape ---------- */
  tracks: [
    { name: "WEB EXPLOITATION",    time: "4:04",  blurb: "SQLi, XSS, SSRF, deserialization… bẻ web như bẻ bánh tráng." },
    { name: "PWN",                 time: "13:37", blurb: "Buffer overflow, ROP, heap. Nói chuyện trực tiếp với bộ nhớ." },
    { name: "CRYPTOGRAPHY",        time: "3:14",  blurb: "RSA, AES, lattice. Toán học nhưng mà ngầu." },
    { name: "FORENSICS",           time: "2:56",  blurb: "PCAP, memory dump, stego. Làm thám tử số." },
    { name: "REVERSE ENGINEERING", time: "6:66",  blurb: "IDA, Ghidra, x64dbg… và đúng rồi, viết keygen như cái trang này." },
    { name: "MISC / OSINT",        time: "0:42",  blurb: "Mọi thứ còn lại. Thường là phần vui nhất." }
  ],

  /* ---------- schedule (side B of the tape) ---------- */
  dates: [                                          // TODO: real dates
    { d: "01.10", t: "MỞ ĐƠN" },
    { d: "20.11", t: "ĐÓNG ĐƠN" },
    { d: "25.11", t: "MINI CTF 24H" },
    { d: "01.12", t: "PHỎNG VẤN" },
    { d: "10.12", t: "WELCOME PARTY" }
  ],

  /* ---------- the MS-Paint pirate: the ONLY voice on the page ----------
     Every hint, every found flag piece and every track description shows up in his bubble.
     Keep lines under ~130 characters so they fit the bubble.
     Placeholders: {n} piece number · {total} how many pieces · {part} the piece text
                   {name} / {blurb} track name / description */
  pirate: {
    intro: "Yo-ho-ho! Chào mừng lên tàu của EPU Cybersecurity Club! Ta đã giấu 10 mảnh flag quanh con tàu này. Cần manh mối thì cứ gõ vào ta.",
    nudge: "Này thủy thủ, đứng ngây ra đó làm gì? Gõ vào ta một cái xem nào!",
    found: "Arrr, khá lắm! Mảnh {n}/{total} của ngươi đây: {part}",
    foundPicture: "Arrr! Mảnh {n}/{total} vừa lộ diện rồi đấy. Nhìn cho kỹ vào, ta không đọc hộ đâu!",
    pictureAgain: "Mảnh {n} thì phải tự nhìn bằng mắt mình. Ta mù chữ, ta không đọc hộ đâu!",
    allFound: "Đủ cả 10 mảnh rồi! Xếp chúng theo số thứ tự rồi dán vào ô License Key của keygen nhé.",
    solved: "Trời đất quỷ thần ơi, ngươi giải được thật rồi! Điền tên với MSSV rồi bấm ACTIVATE, ta sẽ gửi flag đi kèm.",
    closeJoke: "Định bỏ trốn khỏi tàu à? Không dễ thế đâu, thủy thủ!",
    registered: "Arrr! Ta đã ghi tên ngươi vào sổ thủy thủ rồi. Nhớ để ý email nhé!",
    track: "Tóm được một ngôi sao! {name}: {blurb}",
    // one hint per hiding place (the keys match ctf.where below)
    hints: {
      pirate:  "Mảnh đầu tiên ta cất ngay trong túi áo. Gõ vào ta là có.",
      back:    "Lão mặt trời lúc nào cũng quay mặt ra cười. Chẳng ai biết sau gáy lão có gì… thử túm lão xoay lại xem.",
      stars:   "Mấy ngôi sao hồng cứ bay vòng vòng quanh lão mặt trời như lũ hải âu. Tóm hết chúng lại đi!",
      heart:   "Trái tim pixel kia mong manh lắm. Mà tim có vỡ thì mới chịu nói thật lòng…",
      era:     "Hồi 1998 biển còn đen trắng. Kéo cả thế giới về quá khứ rồi nhìn kỹ lão mặt trời xem.",
      risen:   "Cái sọ đỏ kia bị nguyền đấy. Ta đã dặn đừng có đụng vào rồi nhé…",
      sticker: "Mấy cái nhãn dán kia trông khả nghi lắm. Bóc thử một cái xem bên dưới giấu gì.",
      dom:     "Keygen này có một dòng ghi chú giấu trong mã nguồn. Bấm F12 rồi soi kỹ phần Inspector.",
      console: "Có kẻ đã để lại lời nhắn trong Console. Bấm F12 mà xem.",
      storage: "Trình duyệt nhớ dai hơn ngươi tưởng đấy. Mở mục Storage ra lục thử xem."
    },
    // said between hints (the schedule from `dates` is added automatically)
    about: [
      "Chưa biết gì về bảo mật vẫn lên tàu được. Chỉ cần tò mò và chịu học là đủ.",
      "Tụi ta sinh hoạt một, hai buổi mỗi tuần. Cuối tuần thì cả bọn cùng nhau đi đánh CTF.",
      "Muốn nhập bọn thì điền tên với MSSV vào keygen rồi bấm ACTIVATE. Flag chỉ là điểm cộng thôi."
    ],
    schedule: "Lịch trình chuyến đi: {dates}",
    // when someone makes a wish on the big pink star
    wishes: [
      "Ngươi ước gì? AC hết bài à? Cứ mơ đi, thủy thủ!",
      "Điều ước của ngươi là first blood. Ta thích tinh thần đó!",
      "Ước cả đời không gặp segfault à? Ai mà chẳng ước thế.",
      "Ước flag nằm sẵn trong /robots.txt à? Ha! Đâu có dễ vậy."
    ]
  },

  /* ---------- the flag hunt ----------
     10 pieces; the flag = all pieces joined in order (1 → 10), starting with ECSC{.
     - `parts`: text pieces, scrambled (XOR with `key`, then base64). null = a picture piece.
     - `pictures`: picture pieces, stored only as pixels (never as text), drawn by the 3D scene.
       They can't be found with view-source or Ctrl+F. Keep the heart piece ≤ 4 characters.
     - `hash`: SHA-256 of the whole flag; the keygen checks against it, so the flag itself isn't in the code.
     To change the flag: open the site, F12 → Console, run
         EPU.ctf.encode(["ECSC{", "piece2", …], { 2: 5, 6: 4, 7: 4 })
     ({ piece: characters per row } marks the picture pieces) and paste the printed values here.
     `where` says which piece hides where (piece numbers 1–10):
       pirate  = click the pirate                    back    = picture on the back of the smiley's head
       stars   = catch all pink stars                heart   = picture: the voxel heart explodes into letters
       era     = picture: 1998-only ink on the smiley (drag the 1998|2026 split all the way right)
       risen   = wake the skull (RISEN mode)         sticker = peel the PARENTAL ADVISORY sticker off
       dom     = HTML comment inside the keygen (DevTools → Inspector)
       console = DevTools console                    storage = DevTools → Storage → Local Storage */
  ctf: {
    key: "csc2026",
    parts: ["JjAwcUs=", null, "VBtQbQ==", "EUdSXFICQTw=", "AAFXUVtt", null, null, "EUIQAW8=", "BQFTX28=", "FxtQbVQBAgcO"],
    pictures: {
      2: { w: 40, h: 8, bits: "ABgGfgAAOAYMAG4YfhgAcBjGPABgGMYGAGAYxsYAYH5+fAAAAAAA/g==" },
      6: { w: 32, h: 8, bits: "GMB+ABjADAB+/BgAGMY8ABjGBgAYxsYAGMZ8AAAAAP4=" },
      7: { w: 32, h: 17, bits: "wH4APsAMAGDGGMbAzDzGzvgGxsbMxn5mxnwGPgAAfAAAAAAAfgAAAAwAAAAY/AAAPMYAAAbGAADGxgAAfMYAAAAA/gA=" }
    },
    hash: "f84a53ccc01dbeff6b730483bc44fdd8acf4137be01f175ab803ddfc5f62bd5b",
    where: { pirate: 1, back: 2, dom: 3, stars: 4, console: 5, heart: 6, era: 7, risen: 8, storage: 9, sticker: 10 }
  },

  /* ---------- stickers ---------- */
  stickers: {
    splat1: ["100%", "PWN RATE"],
    splat2: ["CTF", "RAVE"],
    advisory: ["PARENTAL", "ADVISORY", "EXPLOIT CONTENT"],
    vhs: ["ECSC", "HOME VIDEOS"]
  },

  /* ---------- keygen window (the join form) ---------- */
  keygen: {
    title: "ECSC_2026_KEYGEN.EXE",
    nameLabel: "Licensed To :",
    idLabel: "System ID :",
    emailLabel: "E-mail :",
    phoneLabel: "Phone No. :",
    trackLabel: "Track :",
    keyLabel: "License Key :",
    namePlaceholder: "Nguyễn Văn A",
    idPlaceholder: "MSSV",
    emailPlaceholder: "ban@gmail.com",
    phonePlaceholder: "09xx xxx xxx",
    trackPlaceholder: "— chọn mảng —",
    keyPlaceholder: "ECSC{…}",
    button: "ACTIVATE",
    credit: "cracked by ECSC"
  },

  /* ---------- links (shown under the keygen) ---------- */
  links: [
    { label: "Facebook", url: "https://facebook.com/" },     // TODO
    { label: "Discord",  url: "https://discord.gg/" },       // TODO
    { label: "Email",    url: "mailto:ecsc@example.com" } // TODO
  ],

  /* ---------- optional images (leave "" to use the built-in look) ---------- */
  logo: "",      // e.g. "assets/img/logo.png" → replaces the "EPU HOME VIDEOS" box
  photo: "",     // e.g. "assets/img/crew.jpg" → shown pink/dithered inside the keygen banner

  /* ---------- faint background text ---------- */
  ghost: "EPU CYBERSECURITY CLUB ✦ TUYỂN MEM ĐỢT 2 ✦ ",

  /* ---------- intro screen ---------- */
  intro: {
    line: "CYBERSECURITY CLUB ✦ RECRUIT 2026",
    scroller: "EPU CYBERSECURITY CLUB PROUDLY PRESENTS ... TUYEN MEM DOT 2 - 2026 ... WEB * PWN * CRYPTO * FORENSICS * REVERSING ... 10 FLAG PIECES ARE HIDDEN IN HERE ... MUSIC: UNREAL SUPERHERO 3 BY KENET & REZ ... GREETZ TO ALL CTF PLAYERS, DEMOSCENERS AND CURIOUS MINDS ... TURN YOUR SPEAKERS UP ...     "
  }
};
