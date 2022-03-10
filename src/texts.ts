import { choice } from './utils.js'

const EMOJIS = [
  ...'⭐🌹🌷👉👌💦🎁🥰✌💗🐈🍆👍🧁💊🔥🎄🥒🥕🥐🎈💡🗝️🎷🎮🏅🏆⚓🚕🛖✈️😆🥥🍒💩🤡',
  ...'💍🐀💃🏻💅🥺🌈🐟👑✊🚑🚒🗿🔮💰❌🦽🏴‍☠️☝️🎉🥳🪅👮🤰🦄🐴🖕',
]

export default {
  demo: [
    '✌💗',
    '🐈👈',
    '⭐‿⭐',
    '🌹🌷🌹',
    '👉👌💦',
    '🎁🥰',
    '(ᵔᴥᵔ)',
    'ಠ_ಠ',
    '(づ￣ ³￣)づ',
    '¯\\_(ツ)_/¯',
    '🌈🐟',
    '🪄✨✨',
    'sex',
    'I see all',
    '🍆👍',
    '🧁',
    '💊',
    'WTF?!',
    'FUCKING,SEX',
    'TOMORROW',
    'tasty,food',
    '🌴summer🌴',
    '💎energy💰',
  ],
  emoji: [
    ...new Set(
      Array.from(Array(500).keys()).map(
        () => `${choice(EMOJIS)}${choice(EMOJIS)}${choice(EMOJIS)}`
      )
    ),
  ],
}
