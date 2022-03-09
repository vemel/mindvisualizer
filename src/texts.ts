import * as vectors from "./vectors.js";

const EMOJIS = [
  ..."⭐🌹🌷👉👌💦🎁🥰✌💗🐈🍆👍🧁💊🔥🎄🥒🥕🥐🎈💡🗝️🎷🎮🏅🏆⚓🚕🛖✈️😆🥥🍒💩🤡",
  ..."💍🐀💃🏻💅🥺🌈🐟👑✊🚑🚒🗿🔮💰❌🦽🏴‍☠️☝️🎉🥳🪅👮🤰🦄🐴🖕",
];

export default {
  demo: [
    "✌💗",
    "🐈👈",
    "⭐‿⭐",
    "🌹🌷🌹",
    "👉👌💦",
    "🎁🥰",
    "(ᵔᴥᵔ)",
    "ಠ_ಠ",
    "(づ￣ ³￣)づ",
    "¯\\_(ツ)_/¯",
    "🌈🐟",
    "🪄✨✨",
    "sex",
    "I see all",
    "🍆👍",
    "🧁",
    "💊",
    "WTF?!",
    "FUCKING SEX",
    "TOMORROW",
    "tasty food",
    "🌴summer🌴",
    "💎energy💰",
  ],
  emoji: Array.from(Array(500).keys()).map(
    () =>
      `${vectors.choice(EMOJIS)}${vectors.choice(EMOJIS)}${vectors.choice(
        EMOJIS
      )}`
  ),
};
