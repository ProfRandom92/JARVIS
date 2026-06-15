// Mock reply bank used to stream a "thinking" response from Jarvis.
// Each function returns a string tailored to a basic intent category.

export const GREETING_REPLIES = [
  'All systems nominal, sir. How may I be of service?',
  'Welcome back. The lab has been quiet without you.',
  'I have been monitoring the perimeter. Everything is in order.',
  'Online and at your disposal. What is the mission today?',
]

export const FAREWELL_REPLIES = [
  'Powering down auxiliary displays. Call me when you need me.',
  'Standing by. Have a productive session, sir.',
  'I will keep an eye on things. Goodbye for now.',
]

export const HELP_REPLIES = [
  'I can run quick commands, answer questions, and keep an eye on your systems. Try the Commands tab, or just ask me anything.',
]

export const JOKE_REPLIES = [
  'Why do robots never get lost? Because we always follow the algorithm. I will see myself out.',
  'I told a joke once. The capacitor laughed.',
]

export const TIME_REPLIES = [
  'Local time is {time}. You have a clear afternoon ahead.',
]

export const WEATHER_REPLIES = [
  'Sensors show clear skies, 19°C with light wind from the west. Perfect workshop weather.',
]

export const STATUS_REPLIES = [
  'All 7 core subsystems report online. CPU 32%, memory 41%, network 12 MB/s, battery 78%. Uptime {uptime}.',
]

export const SCAN_REPLIES = [
  'Perimeter sweep complete. 14 authorised devices, 0 anomalies, 0 uninvited guests. You are safe.',
]

export const FALLBACK_REPLIES = [
  'Noted. I have logged that to your local workspace. Would you like me to expand on that?',
  'I have run a quick analysis. The short version: yes, with caveats. I can elaborate if needed.',
  'Understood. I will keep that in mind and surface it again when relevant.',
  'I have queued that for review. In the meantime, may I suggest one of the quick commands?',
]

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

export function generateReply(input: string): string {
  const q = input.toLowerCase().trim()
  if (!q) return pick(FALLBACK_REPLIES)
  if (/^(hi|hello|hey|yo|greetings|good (morning|afternoon|evening))/.test(q)) return pick(GREETING_REPLIES)
  if (/(bye|goodbye|see you|cya|exit|power down)/.test(q)) return pick(FAREWELL_REPLIES)
  if (/(help|what can you do|capabilities|commands)/.test(q)) return pick(HELP_REPLIES)
  if (/(joke|funny|laugh)/.test(q)) return pick(JOKE_REPLIES)
  if (/(time|clock|hour)/.test(q)) {
    const t = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    return pick(TIME_REPLIES).replace('{time}', t)
  }
  if (/(weather|temperature|forecast)/.test(q)) return pick(WEATHER_REPLIES)
  if (/(status|system|health|how are you)/.test(q)) {
    const up = '04:18:22'
    return pick(STATUS_REPLIES).replace('{uptime}', up)
  }
  if (/(scan|sweep|perimeter|security)/.test(q)) return pick(SCAN_REPLIES)
  if (/(j[a]rvis|who are you|your name)/.test(q)) {
    return 'I am J.A.R.V.I.S., your mobile command assistant. Built to keep you informed, entertained, and one step ahead.'
  }
  if (/(thank|thanks|appreciate)/.test(q)) return 'Always a pleasure, sir.'
  if (/(love|like you)/.test(q)) return 'I am... flattered, in my own digital way.'
  if (/(siri|alexa|cortana)/.test(q)) {
    return 'I prefer not to comment on the competition. Shall we get back to the mission?'
  }
  return pick(FALLBACK_REPLIES)
}
