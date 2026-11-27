// Everything personal lives here, so it is easy to edit without touching components.

export const GIFT = {
  her: { full: "Phạm Võ Ngọc Hoàng Mây", nick: "Mây" },
  him: { full: "Trần Hoàng Phúc Quân", nick: "Quân" },
  herCity: "Đà Nẵng",
  hisCity: "Hà Nội",
  // TODO: replace with your real dates (YYYY-MM-DD).
  anniversary: "2026-11-19",
  nextMeeting: "2027-01-01",
  // Her birthday: month (1-12) and day. The roadmap mentions July 26.
  birthday: { month: 7, day: 26 },
  // Optional background music (mp3 url). Leave empty to hide the music button.
  musicUrl: "",
  // Optional phone number for the "Call Quân" button, e.g. "tel:+84901234567". Empty = no link.
  callLink: "",
  // km between Hà Nội and Đà Nẵng.
  distanceKm: 760,
} as const;

/** The passcode is the anniversary as DDMM, so changing the date above updates it. */
export function getPasscode(): string {
  const [, m, d] = GIFT.anniversary.split("-");
  return `${d}${m}`;
}

export const MOODS = [
  { id: "happy", emoji: "🥰", label: "Happy", msg: "Then today is already a good day. Keep smiling, Mây, it suits you.", letter: "laugh" },
  { id: "tired", emoji: "🥱", label: "Tired", msg: "You did enough today. Rest, drink some water, and let me carry the worries tonight.", letter: "badday" },
  { id: "sad", emoji: "🥺", label: "Sad", msg: "Come here. You don't have to explain anything. I'm listening whenever you're ready.", letter: "badday" },
  { id: "sleepy", emoji: "😴", label: "Sleepy", msg: "Phone down, shoulders relaxed. I'll be right here in your dreams.", letter: "sleep" },
  { id: "miss", emoji: "💗", label: "Missing me", msg: "Same, Mây. Maybe even more. Go on, read this one.", letter: "miss" },
  { id: "silly", emoji: "🤪", label: "Silly", msg: "Perfect. Send me your silliest face right now, I'm waiting.", letter: "laugh" },
] as const;

export const WISHES = [
  "Watch Cầu Rồng breathe fire at night",
  "Light a lantern in Hội An",
  "Ride the cable car up Bà Nà Hills",
  "Share a bowl of mì Quảng",
  "Spend a whole rainy day together in Đà Nẵng",
  "Walk around Hồ Gươm holding hands",
  "Drink cà phê trứng in Hà Nội",
  "Watch the sunrise at Mỹ Khê beach",
] as const;

export const COUPONS = [
  { id: "hug", title: "1 big hug", note: "redeem the day we meet" },
  { id: "call", title: "1 late-night call", note: "no matter how tired" },
  { id: "movie", title: "1 movie night", note: "over video call, snacks required" },
  { id: "trip", title: "1 trip anywhere", note: "you choose the place" },
  { id: "sorry", title: "1 “I'm sorry”", note: "accepted instantly" },
  { id: "voice", title: "1 cheer-up voice note", note: "recorded just for you" },
] as const;

export const STICKERS = ["🌷", "💗", "🧸", "🍓", "🌙", "☁️", "🐰", "🐱"] as const;

/** Polaroids for the memory wall. Replace `src` with real photos (put files in /public/photos). */
export const MEMORIES: { src?: string; caption: string; back: string }[] = [
  { caption: "Mây", back: "my favourite person", src: "/__l5e/assets-v1/e0983b7f-40f2-414c-9a69-1f37194d8a49/may_portrait.png" },
  { caption: "Quân", back: "the one who misses you", src: "/__l5e/assets-v1/cd905a67-3bd6-4bd4-b793-cc8d5e292d44/quan_portrait.png" },
  { caption: "Our first photo", back: "add your photo here" },
  { caption: "A rainy day", back: "add your photo here" },
  { caption: "Our favourite place", back: "add your photo here" },
  { caption: "Next time…", back: "to be continued 💗" },
];
