import { hashString } from './random'

const PROMPTS = [
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', by: 'Will Durant' },
  { text: 'The expert in anything was once a beginner.', by: 'Helen Hayes' },
  { text: 'What is one small thing you did today that your future self will thank you for?' },
  { text: 'Little by little, one travels far.', by: 'J.R.R. Tolkien' },
  { text: 'Be not afraid of growing slowly; be afraid only of standing still.', by: 'Chinese proverb' },
  { text: 'Write it on your heart that every day is the best day in the year.', by: 'Ralph Waldo Emerson' },
  { text: 'What surprised you today, and what did it teach you?' },
  { text: 'Fill your paper with the breathings of your heart.', by: 'William Wordsworth' },
  { text: 'The secret of getting ahead is getting started.', by: 'Mark Twain' },
  { text: 'What did you notice today that you would have missed a year ago?' },
  { text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', by: 'Mahatma Gandhi' },
  { text: 'Who helped you today, and how could you return the kindness?' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', by: 'Confucius' },
  { text: 'What felt hard today that would have felt impossible last month?' },
  { text: 'Keep a diary, and someday it will keep you.', by: 'Mae West' },
  { text: 'Small deeds done are better than great deeds planned.', by: 'Peter Marshall' },
  { text: 'Which habit served you well today? Which one tried to trip you up?' },
  { text: 'I am not afraid of storms, for I am learning how to sail my ship.', by: 'Louisa May Alcott' },
  { text: 'Describe a moment today when you were completely present.' },
  { text: 'Knowing is not enough; we must apply.', by: 'Johann Wolfgang von Goethe' },
  { text: 'What question are you carrying into tomorrow?' },
  { text: 'A journal is a place to meet yourself.', by: 'Anonymous' },
  { text: 'Growth is never by mere chance; it is the result of forces working together.', by: 'James Cash Penney' },
  { text: 'What would you tell yesterday-you, now that you know what you know today?' },
  { text: 'Nature does not hurry, yet everything is accomplished.', by: 'Lao Tzu' },
  { text: 'Name one mistake from today and the lesson tucked inside it.' },
  { text: 'The beautiful thing about learning is that no one can take it away from you.', by: 'B.B. King' },
  { text: 'What made you smile today, even briefly?' },
  { text: 'Do the best you can until you know better. Then when you know better, do better.', by: 'Maya Angelou' },
  { text: 'One day or day one. You decide.' },
]

export function promptForDate(key) {
  return PROMPTS[hashString(key) % PROMPTS.length]
}
