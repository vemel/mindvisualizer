import * as vectors from './vectors.js'

const EMOJIS = [..."⭐🌹🌷👉👌💦🎁🥰✌💗🐈🍆👍🧁💊🔥💑🎄🥒🥕🥐🎈💡🕯️🗝️🎷🎮🏅🏆⚓🚕🛖✈️"]

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
        "секс",
        "всё вижу",
        "🍆👍",
        "🧁",
        "💊",
        "как это?!",
        "ебать секс",
        "завтра!",
        "вкусная еда",
        "🌴лето🌴",
        "💎энергия💰"
    ],
    emoji: Array.from(Array(500).keys()).map(() => `${vectors.choice(EMOJIS)}${vectors.choice(EMOJIS)}${vectors.choice(EMOJIS)}`)
}