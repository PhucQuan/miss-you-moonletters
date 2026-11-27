export type LetterTheme = "miss" | "badday" | "sleep" | "laugh" | "goodbye" | "rain" | "birthday";

export type Letter = {
  id: string;
  /** Text after "Open when …" */
  label: string;
  body: string;
  theme: LetterTheme;
  /** Only shown on her birthday (see GIFT.birthday). */
  bonus?: boolean;
};

export const LETTERS: Letter[] = [
  {
    id: "miss",
    label: "you miss me",
    theme: "miss",
    body: "The distance between Ha Noi and Da Nang might feel long at times, but it has never stopped you from being on my mind. Whenever you open this, know that I'm probably missing you just as much. Give me a call if you're free, or simply put on our favorite song and remember that I'm always right here, thinking of you and counting down the days until I see you again.",
  },
  {
    id: "badday",
    label: "you had a bad day",
    theme: "badday",
    body: "You've worked so hard today. I know things didn't go the way you wanted and left you exhausted, but it's okay—you don't have to stay strong all the time. Put your work and stress aside for tonight, drink a warm glass of water, and take a deep breath. Whenever you're ready, text or call me. I'm always here to listen to everything on your mind.",
  },
  {
    id: "sleep",
    label: "you can't sleep",
    theme: "sleep",
    body: "It must be pretty quiet in Da Nang right now, just like it is here in Ha Noi. If your mind is racing and keeping you awake, try putting your phone down, taking a few slow breaths, and letting your shoulders relax. Don't worry about tomorrow just yet. Close your eyes and imagine I'm right beside you wishing you a good night. Everything will be alright in the morning.",
  },
  {
    id: "laugh",
    label: "you need a laugh",
    theme: "laugh",
    body: "If you're opening this letter, you probably have a super serious look on your face right now—relax those facial muscles! Whenever life gets a little too heavy, just think back to all the silly things I've done or those random, nonsensical conversations we always have. Just picturing you smiling while reading this makes my day. Now give me a smile!",
  },
  {
    id: "goodbye",
    label: "we just said goodbye",
    theme: "goodbye",
    body: "That empty feeling right after saying goodbye is always the hardest part, and I'm feeling it just as much as you are. Instead of dwelling on the distance between Ha Noi and Da Nang again, let's hold onto the happiness from the days we just spent together. Every goodbye is really just the start of the countdown to our next hello. Thank you for the wonderful time we had.",
  },
  {
    id: "rain",
    label: "it's raining",
    theme: "rain",
    body: "The sound of rain always makes things feel a little quieter and makes me miss you a lot more. If you're out on the road, please be careful, and make sure to dry off and stay warm once you get home so you don't catch a cold. On rainy days like this, I really wish I were in Da Nang with you—sharing a warm meal, staying out of the rain, and talking about everything under the sun.",
  },
  {
    id: "birthday",
    label: "it's your birthday",
    theme: "birthday",
    bonus: true,
    body: "Happy birthday, Mây! I wish I could be standing next to you with a cake and a terribly off-key song, but I hope this little corner of the internet feels like a hug from me. Thank you for being you, for being patient with the distance, and for making ordinary days feel special. Make a big wish tonight. I'll be wishing for the same thing: the next time we're in the same city.",
  },
];
