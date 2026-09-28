window.SITE = {

  club: "EPU Cybersecurity Club",
  short: "ECSC",

  title: {
    landscape: ["EPU CYBERSECURITY CLUB"],
    portrait: ["EPU CYBER", "SECURITY CLUB"]
  },

  recruit: { big: "TUYỂN MEM", small: "ĐỢT 2 · 2026" },

  dateLine: "HẠN CHÓT 20.11 · 23:59",

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
    tracks: ["Web Exploit", "Binary Exploit", "RE", "Cryptography", "Forensics"]
  },
  deadline: "2026-11-20T23:59:00+07:00",

  music: {
    src: "assets/audio/unreal-superhero-3.mp3",
    title: "Unreal Super Hero 3",
    artist: "Kenet & Rez",
    bpm: 128,
    volume: 0.75,
    soundcloudUrl: "https://soundcloud.com/demoscenemusic/unreal-superhero-3"
  },

  tracks: [
    { name: "WEB EXPLOITATION",    time: "4:04",  blurb: "SQLi, XSS, SSRF, deserialization… bẻ web như bẻ bánh tráng." },
    { name: "PWN",                 time: "13:37", blurb: "Buffer overflow, ROP, heap. Nói chuyện trực tiếp với bộ nhớ." },
    { name: "CRYPTOGRAPHY",        time: "3:14",  blurb: "RSA, AES, lattice. Toán học nhưng mà ngầu." },
    { name: "FORENSICS",           time: "2:56",  blurb: "PCAP, memory dump, stego. Làm thám tử số." },
    { name: "REVERSE ENGINEERING", time: "6:66",  blurb: "IDA, Ghidra, x64dbg… và đúng rồi, viết keygen như cái trang này." },
    { name: "MISC / OSINT",        time: "0:42",  blurb: "Mọi thứ còn lại. Thường là phần vui nhất." }
  ],

  dates: [
    { d: "01.10", t: "MỞ ĐƠN" },
    { d: "20.11", t: "ĐÓNG ĐƠN" },
    { d: "25.11", t: "MINI CTF 24H" },
    { d: "01.12", t: "PHỎNG VẤN" },
    { d: "10.12", t: "WELCOME PARTY" }
  ],

  pirate: {
    intro: "Yo-ho-ho! Chào mừng lên tàu của EPU Cybersecurity Club! Ta đã giấu 10 mảnh flag quanh con tàu này. Cần manh mối thì cứ gõ vào ta.",
    nudge: "Này thủy thủ, đứng ngây ra đó làm gì? Gõ vào ta một cái xem nào!",
    found: "Arrr, khá lắm! Mảnh {n}/{total} của ngươi đây: {part}",
    foundPicture: "Arrr! Mảnh {n}/{total} vừa lộ diện rồi đấy. Nhìn cho kỹ vào, ta không đọc hộ đâu!",
    pictureAgain: "Mảnh {n} thì phải tự nhìn bằng mắt mình. Ta mù chữ, ta không đọc hộ đâu!",
    allFound: "Đủ cả 10 mảnh rồi! Xếp chúng theo số thứ tự rồi dán vào ô License Key của keygen nhé.",
    solved: "Trời đất quỷ thần ơi, ngươi giải được thật rồi! Điền nốt thông tin rồi bấm ACTIVATE, ta sẽ gửi flag đi kèm.",
    closeJoke: "Định bỏ trốn khỏi tàu à? Không dễ thế đâu, thủy thủ!",
    registered: "Arrr! Ta đã ghi tên ngươi vào sổ thủy thủ rồi. Nhớ để ý email nhé!",
    track: "Tóm được một ngôi sao! {name}: {blurb}",
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
    about: [
      "Chưa biết gì về bảo mật vẫn lên tàu được. Chỉ cần tò mò và chịu học là đủ.",
      "Tụi ta sinh hoạt một, hai buổi mỗi tuần. Cuối tuần thì cả bọn cùng nhau đi đánh CTF.",
      "Muốn nhập bọn thì điền thông tin vào keygen rồi bấm ACTIVATE. Flag chỉ là điểm cộng thôi."
    ],
    schedule: "Lịch trình chuyến đi: {dates}",
    wishes: [
      "Ngươi ước gì? AC hết bài à? Cứ mơ đi, thủy thủ!",
      "Điều ước của ngươi là first blood. Ta thích tinh thần đó!",
      "Ước cả đời không gặp segfault à? Ai mà chẳng ước thế.",
      "Ước flag nằm sẵn trong /robots.txt à? Ha! Đâu có dễ vậy."
    ]
  },

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

  stickers: {
    splat1: ["100%", "PWN RATE"],
    splat2: ["CTF", "RAVE"],
    advisory: ["PARENTAL", "ADVISORY", "EXPLOIT CONTENT"],
    vhs: ["ECSC", "HOME VIDEOS"]
  },

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

  links: [
    { label: "Facebook", url: "https://facebook.com/" },
    { label: "Discord",  url: "https://discord.gg/" },
    { label: "Email",    url: "mailto:ecsc@example.com" }
  ],

  logo: "",
  photo: "",

  ghost: "EPU CYBERSECURITY CLUB ✦ TUYỂN MEM ĐỢT 2 ✦ ",

  intro: {
    line: "CYBERSECURITY CLUB ✦ RECRUIT 2026",
    scroller: "EPU CYBERSECURITY CLUB PROUDLY PRESENTS ... TUYEN MEM DOT 2 - 2026 ... WEB * PWN * CRYPTO * FORENSICS * REVERSING ... 10 FLAG PIECES ARE HIDDEN IN HERE ... MUSIC: UNREAL SUPERHERO 3 BY KENET & REZ ... GREETZ TO ALL CTF PLAYERS, DEMOSCENERS AND CURIOUS MINDS ... TURN YOUR SPEAKERS UP ...     "
  }
};
