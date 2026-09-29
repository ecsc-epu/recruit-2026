window.SITE = {

  club: "EPU Cybersecurity Club",
  short: "ECSC",

  title: {
    landscape: ["EPU CYBERSECURITY CLUB"],
    portrait: ["EPU CYBER", "SECURITY CLUB"]
  },

  recruit: { big: "TUYỂN THÀNH VIÊN", small: "ĐỢT 2" },

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
    volume: 0.45,
    soundcloudUrl: "https://soundcloud.com/demoscenemusic/unreal-superhero-3"
  },

  tracks: [
    { name: "WEB EXPLOITATION",    time: "4:04",  blurb: "Tìm lỗ hổng trong ứng dụng web như SQL injection, XSS, SSRF để lọt vào nơi không được phép vào." },
    { name: "PWN",                 time: "13:37", blurb: "Khai thác lỗi bộ nhớ của chương trình như buffer overflow, ROP, heap để chiếm quyền điều khiển máy." },
    { name: "CRYPTOGRAPHY",        time: "3:14",  blurb: "Tìm chỗ các hệ mã hoá như RSA, AES hay hàm băm bị dùng sai, rồi giải mã thứ lẽ ra phải bí mật." },
    { name: "FORENSICS",           time: "2:56",  blurb: "Làm thám tử số, lần theo dấu vết trong gói tin mạng, bộ nhớ, ổ đĩa và ảnh giấu tin." },
    { name: "REVERSE ENGINEERING", time: "6:66",  blurb: "Mổ xẻ chương trình không có mã nguồn bằng IDA, Ghidra để hiểu nó chạy ra sao. Keygen sinh ra từ đây." },
    { name: "MISC / OSINT",        time: "0:42",  blurb: "Truy tìm thông tin từ nguồn công khai, cộng những thử thách lạ không thuộc mảng nào." }
  ],

  dates: [
    { d: "01.10", t: "MỞ ĐƠN" },
    { d: "20.11", t: "ĐÓNG ĐƠN" },
    { d: "25.11", t: "MINI CTF 24H" },
    { d: "01.12", t: "PHỎNG VẤN" },
    { d: "10.12", t: "WELCOME PARTY" }
  ],

  pirate: {
    intro: "Yo-ho-ho! Chào mừng lên tàu của ECSC! Ta đã giấu 10 mảnh flag quanh con tàu này. Cần manh mối thì cứ gõ vào ta.",
    nudge: "Này thủy thủ, đứng ngây ra đó làm gì? Gõ vào ta một cái xem nào!",
    // a text piece is found (one line per piece, in turn)
    found: [
      "Arrr, khá lắm! Mảnh {n}/{total} của ngươi đây, \"{part}\".",
      "Thêm một đồng vàng vào rương! Mảnh {n}/{total} là \"{part}\".",
      "Mũi ngươi thính hơn cả chó săn của ta. Mảnh {n}/{total} là \"{part}\".",
      "Cất \"{part}\" cho kỹ, đừng để lũ hải âu tha mất. Đó là mảnh {n}/{total} đấy.",
      "Yo-ho! Mảnh {n}/{total} lộ diện rồi, \"{part}\".",
      "Ta mà tò mò được bằng nửa ngươi thì đã thành vua hải tặc. Mảnh {n}/{total} là \"{part}\".",
      "Chép vội \"{part}\" vào tay đi kẻo quên. Mảnh {n}/{total} đấy!"
    ],
    // a text piece with its own line (keys = hiding places in ctf.where); the others use `found`
    foundAt: {
      song: "Bravo! Ngón đàn nghe như mèo giẫm lên bàn phím, nhưng cái tên CLB vẫn chịu nhả ra mảnh {n}/{total}, \"{part}\". Thôi đừng bỏ nghề hacker để đi làm nhạc công nhé."
    },
    // a picture piece is found / asked for again (keys = hiding places in ctf.where)
    foundPicture: {
      back: "Ối, lão mặt trời có hình xăm sau gáy! Mảnh {n}/{total} đấy, chép lại nhanh, ta mù chữ không đọc hộ được đâu.",
      heart: "Tim vỡ tan tành mà vẫn kịp nói lời thật lòng. Mảnh {n}/{total}, nhìn nhanh kẻo nó liền lại!",
      era: "Phải về tận 1998 mới thấy chữ! Mảnh {n}/{total} đấy, dí mắt vào màn hình mà đọc.",
      other: "Arrr! Mảnh {n}/{total} vừa lộ diện rồi đấy. Nhìn cho kỹ vào, ta không đọc hộ đâu!"
    },
    pictureAgain: {
      back: "Mảnh {n} xăm sau gáy lão mặt trời. Ta xoay lão lại cho ngươi xem, đừng bắt ta đọc, ta mù chữ!",
      heart: "Mảnh {n} hả? Để ta đập vỡ trái tim kia lần nữa. Nhìn cho kỹ, ta không tốn thuốc súng mãi đâu.",
      era: "Mảnh {n} chỉ hiện ở năm 1998. Ta sinh năm 1720, với ta 1998 còn là tương lai đấy!",
      other: "Mảnh {n} thì phải tự nhìn bằng mắt mình. Ta mù chữ, ta không đọc hộ đâu!"
    },
    textAgain: [
      "Mảnh {n} là \"{part}\". Quên nữa là ta bắt đi lau boong tàu đấy.",
      "Lại quên à? Mảnh {n} là \"{part}\". Trí nhớ còn kém hơn cả ta.",
      "\"{part}\", mảnh {n} đấy. Lần này ghi ra giấy giùm ta."
    ],
    allFound: "Đủ cả 10 mảnh rồi! Xếp chúng theo số thứ tự rồi dán vào ô License Key của keygen nhé.",
    solved: "Trời đất quỷ thần ơi, ngươi giải được thật rồi! Điền nốt thông tin rồi bấm ACTIVATE, ta sẽ gửi flag đi kèm.",
    closeJoke: "Định bỏ trốn khỏi tàu à? Không dễ thế đâu, thủy thủ!",
    registered: "Arrr! Ta đã ghi tên ngươi vào sổ thủy thủ rồi. Nhớ để ý email nhé!",
    solvedNeedInfo: "Giỏi lắm, thủy thủ! Nhưng flag chưa được ghi nhận đâu. Điền tên, MSSV, email, SĐT, chọn mảng rồi bấm ACTIVATE thì ta mới biết ai là người giải!",
    solvedReminder: "Ê, ngươi giải xong flag rồi mà chưa đăng ký kìa! Điền keygen rồi bấm ACTIVATE đi, không là mất điểm cộng đấy.",
    track: "{name} à? {blurb}",
    hints: {
      pirate:  "Mảnh đầu tiên ta cất ngay trong túi áo. Gõ vào ta là có.",
      back:    "Lão mặt trời lúc nào cũng quay mặt ra cười. Chẳng ai biết sau gáy lão có gì… thử túm lão xoay lại xem.",
      stars:   "Mấy ngôi sao hồng cứ bay vòng vòng quanh lão mặt trời như lũ hải âu. Tóm hết chúng lại đi!",
      heart:   "Trái tim pixel kia mong manh lắm. Mà tim có vỡ thì mới chịu nói thật lòng…",
      era:     "Hồi 1998 biển còn đen trắng. Kéo cả thế giới về quá khứ rồi nhìn kỹ lão mặt trời xem.",
      song:    "Tên CLB trên kia sáng bóng như dây đàn. Lướt tay qua một lượt xem, biết đâu nó hát cho ngươi nghe…",
      sticker: "Mấy cái nhãn dán kia trông khả nghi lắm. Bóc thử một cái xem bên dưới giấu gì.",
      dom:     "Keygen này có một dòng ghi chú giấu trong mã nguồn. Bấm F12 rồi soi kỹ phần Inspector.",
      console: "Có kẻ đã để lại lời nhắn trong Console. Bấm F12 mà xem.",
      storage: "Trình duyệt nhớ dai hơn ngươi tưởng đấy. Mở mục Storage ra lục thử xem."
    },
    guide: [
      "Cái cửa sổ tím có chữ keygen chính là đơn đăng ký. Điền tên, MSSV, email, SĐT, chọn mảng rồi dán flag vào ô License Key là xong.",
      "Thấy 10 ô hồng dưới ô License Key không? Đó là sổ lưu mảnh flag. Tìm được mảnh nào thì ô đó sáng lên và được giữ lại.",
      "Bấm vào ô hồng nào đã sáng thì ta đọc lại mảnh đó cho ngươi. Quên thì cứ bấm, ta không mắng đâu.",
      "Nút ACTIVATE bị khoá cho tới khi ngươi dán đúng cả flag. Gom đủ 10 mảnh, ghép theo số thứ tự là ra.",
      "Cái thanh 1998 ◂▸ 2026 kéo qua lại được. Một bên là thế giới đen trắng hồi 1998, bên kia là 2026.",
      "Gần như thứ gì ở đây cũng kéo đi được, từ sticker, băng cassette cho tới cả ta. Riêng keygen thì kéo bằng thanh tiêu đề tím.",
      { text: "Cuộn băng cassette kia có hai mặt. Mặt A là các mảng, mặt B là lịch trình. Bấm vào tên mảng để ta giới thiệu mảng đó.", desktop: true }
    ],
    // said when the player does the thing
    on: {
      countdown: "Thấy cái đồng hồ đếm ngược kia không? Đồ giả đấy! Cái thật ta đã nhốt trong Rương Người Chết, nằm ngay cạnh trái tim của Davy Jones. Nhưng hạn chót thì là thật, hết giờ là tàu nhổ neo!",
      locked: "Muốn nhập bọn mà không có flag à? Ha! Đến con vẹt của ta còn phải giải flag mới được lên tàu đấy.",
      poke3d: "Thứ gì ở đây cũng bấm được, trừ trái tim của ta. Nó bị cá mập đớp mất từ năm 1998 rồi.",
      risenOn: [
        "Trời đỏ như máu thế này?! Tàu ta bị nguyền rồi! Ta đã dặn đừng có đụng vào cái sọ kia mà!",
        "Lời nguyền đồng vàng Aztec đây mà! Dưới ánh trăng ta sẽ hoá thành bộ xương… may mà ta vốn gầy sẵn.",
        "Nhạc chậm lại, trời đỏ lòm… Đến tàu ma Flying Dutchman cũng không rùng rợn bằng cái trang này.",
        "Ta không sợ! Ta chỉ… run vì gió biển thôi. Ai đó tắt cái lời nguyền này đi được không?"
      ],
      risenOff: [
        "Phù, hết nguyền rồi. Lần sau đụng vào cái sọ thì báo trước ta một tiếng!",
        "Trời hồng lại rồi. Nói trước, ban nãy ta không hề sợ, chỉ đang tập nhảy thôi.",
        "Lời nguyền đã giải! Giờ thì ta cần một ly rum cho hoàn hồn."
      ],
      titleSong: "Ngươi vừa chơi đàn trên tên CLB của ta đấy à? Hay đấy, nhưng đừng bỏ nghề hacker để đi làm nhạc công nhé.",
      squeeze: "Thôi đừng bóp nữa! Máu chảy hết thì lấy gì mà tuyển thành viên? Ta còn phải lau boong tàu đấy.",
      muteFound: "Bóp mạnh quá, cái nút tắt nhạc ta giấu văng ra góc màn hình rồi kìa! Đừng bảo ai là ta giấu nó nhé.",
      muteOn: "Ai tắt nhạc của ta?! Được thôi, ta tự hát vậy. Yo-ho, yo-ho, cuộc đời hải tặc là ta…",
      muteOff: "Nhạc về rồi! Tai ta cảm ơn ngươi, chứ giọng ta thì cá mập nghe còn bỏ chạy.",
      dragBubble: "Ngươi định kéo lời vàng ý ngọc của ta đi đâu thế hả? Kéo thì kéo, nhưng bấm vào là ta lại lải nhải tiếp đấy."
    },
    // said once, the first time something happens
    tips: {
      firstPiece: "Thấy ô số {n} trong keygen vừa sáng hồng chưa? Mảnh nào tìm được sẽ được lưu vào đó, tắt trang mở lại vẫn còn. Bấm vào ô để ta đọc lại.",
      firstStar: "Mỗi ngôi sao bắt được sẽ được đánh dấu ★ trên băng cassette. Bắt đủ 6 ngôi sao xem có gì hay không…"
    },
    about: [
      "Chưa biết gì về bảo mật vẫn lên tàu được. Chỉ cần tò mò và chịu học là đủ.",
      "Tụi ta sinh hoạt một, hai buổi mỗi tuần. Cuối tuần thì cả bọn cùng nhau đi đánh CTF."
    ],
    schedule: "Lịch trình chuyến đi của tụi ta là {dates}.",
    wishes: [
      "Ngươi ước gì? AC hết bài à? Cứ mơ đi, thủy thủ!",
      "Ước first blood à? Được thôi, miễn là cả đội kia ngủ quên.",
      "Ước cả đời không gặp segfault? Ngôi sao này ban điều ước, không làm phép màu.",
      "Ước flag nằm sẵn trong /robots.txt à? Ngây thơ quá, thủy thủ.",
      "Ngươi vừa thành tâm cầu nguyện với một ngôi sao nhựa. Ta không có gì để nói thêm.",
      "Ước crypto dễ hơn à? Toán học không nghe thấy lời ước đâu.",
      "Ước deadline lùi lại? Ngôi sao không có quyền đó. Ban tổ chức cũng không.",
      "Điều ước của ngươi đã được ghi nhận… vào /dev/null.",
      "Ước code chạy đúng ngay lần đầu? Đến ngôi sao cũng phải bật cười.",
      "Lại ước nữa à? Sao băng cũng có rate limit đấy, 429 Too Many Wishes.",
      "Ước được vào CLB mà khỏi điền form? Cái form ngay bên dưới kìa, lười vừa thôi.",
      "Ta từng ước có một con vẹt. Giờ ta có một ngôi sao biết cười. Đời là thế.",
      "Ước sẽ hiểu ngay cái heap exploit đầu tiên? Ta ước có kho báu, vẫn đang chờ đây.",
      "Ngôi sao bảo ngươi nên ước ít đi và đọc writeup nhiều hơn."
    ]
  },

  ctf: {
    hash: "f84a53ccc01dbeff6b730483bc44fdd8acf4137be01f175ab803ddfc5f62bd5b",
    pics: [2,6,7],
    seal: [
      "rzvetvhH",
      "62drBs4XuEb5gV4lTrynWBqMIkMDMa8UvIFnyD+PAqBCfP872ewXe4HOtizxTmjH9Nu8qSt9sdTYf/vgoOo=",
      "Be1DHAM=",
      "wL3iitLH3Ir3",
      "5Bke5bE7pQ==",
      "UrBiPc92r6dV2SU4StrczRdmFTg+bipQ/SqgNVgCh4nGidvWLk42srzMV7xpey2tvN0=",
      "z2sXtVVSK8nDgpfz6w57D2zAsemwyRVZYBJiVGFPvYbhD0rmXpJ/OPWlvghO0TCtdlDa1L+z35WBSvwstx21nhFrOQ0g0C9f+zLbyPmE/HHDbIM/ehhnNwr0yP3I2JQp4+Sa",
      "OwEHl1fM",
      "vs1BTrbc",
      "Wi46LhWJrQzOjw=="
    ],
    where: {"pirate":1,"back":2,"dom":3,"stars":4,"console":5,"heart":6,"era":7,"song":8,"storage":9,"sticker":10}
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
    credit: "something might be here"
  },

  links: [
    { label: "Facebook", url: "https://www.facebook.com/ecsc235" },
    { label: "Discord",  url: "https://discord.gg/ZcGVqAJSx5" },
    { label: "Email",    url: "mailto:ecsc.club.epu@gmail.com" }
  ],

  logo: "",
  photo: "",

  ghost: "EPU CYBERSECURITY CLUB ✦ TUYỂN THÀNH VIÊN ĐỢT 2 ✦ ",

  intro: {
    line: "EPU Cybersecurity Club - Recruit 2026",
    scroller: "EPU CYBERSECURITY CLUB PROUDLY PRESENTS ... TUYEN MEM DOT 2 - 2026 ... WEB * PWN * CRYPTO * FORENSICS * REVERSING ... 10 FLAG PIECES ARE HIDDEN IN HERE ... MUSIC: UNREAL SUPERHERO 3 BY KENET & REZ ... GREETZ TO ALL CTF PLAYERS, DEMOSCENERS AND CURIOUS MINDS ... TURN YOUR SPEAKERS UP ...     "
  }
};
