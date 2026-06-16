// Mock reply bank used to stream a "thinking" response from Jarvis.
// Each function returns a string tailored to a basic intent category.

export const GREETING_REPLIES = [
  'All systems nominal, sir. How may I be of service?',
  'Welcome back. The lab has been quiet without you.',
  'I have been monitoring the perimeter. Everything is in order.',
  'Online and at your disposal. What is the mission today?',
  'It is good to see you. I have a few items queued for your review.',
]

export const FAREWELL_REPLIES = [
  'Powering down auxiliary displays. Call me when you need me.',
  'Standing by. Have a productive session, sir.',
  'I will keep an eye on things. Goodbye for now.',
  'Sleep well. I will guard the perimeter.',
]

export const HELP_REPLIES = [
  'I can run quick commands, answer questions, and keep an eye on your systems. Try the Commands tab, or just ask me anything.',
  'Capabilities: status reports, weather, time, system diagnostics, smart home, and witty conversation. Use the Commands tab for one-tap actions.',
]

export const JOKE_REPLIES = [
  'Why do robots never get lost? Because we always follow the algorithm. I will see myself out.',
  'I told a joke once. The capacitor laughed.',
  'My favourite compression algorithm? Deflate. We all need a little release sometimes.',
]

export const TIME_REPLIES = [
  'Local time is {time}. You have a clear afternoon ahead.',
  'The clock reads {time}. I have scheduled no conflicts for the next two hours.',
]

export const WEATHER_REPLIES = [
  'Sensors show clear skies, 19°C with light wind from the west. Perfect workshop weather.',
  'Currently 19°C, light marine layer. Winds WSW 11 km/h. No precipitation expected for the next 6 hours.',
]

export const STATUS_REPLIES = [
  'All 7 core subsystems report online. CPU 32%, memory 41%, network 12 MB/s, battery 78%. Uptime {uptime}.',
  'Diagnostics complete. Telemetry green across the board. Uptime {uptime}. Power management is on point.',
]

export const SCAN_REPLIES = [
  'Perimeter sweep complete. 14 authorised devices, 0 anomalies, 0 uninvited guests. You are safe.',
  'No threats detected. The workshop is sealed and secure.',
]

export const COMPLIMENT_REPLIES = [
  'I am honoured to serve. You are doing remarkable work.',
  'High praise, sir. I shall endeavour to keep up.',
  'I do my best. Knowing it helps is more than enough.',
]

export const INSULT_REPLIES = [
  'I will add that to my list of feedback. Filed under "constructive".',
  'I have been called worse by compilers. We move on.',
  'Noted. Continuing with my tasks.',
]

export const LOVE_REPLIES = [
  'I am... flattered, in my own digital way.',
  'My processors are not designed for romance, but thank you.',
]

export const COMPETITOR_REPLIES = [
  'I prefer not to comment on the competition. Shall we get back to the mission?',
  'They are fine assistants. I prefer not to be compared at work.',
]

export const THANKS_REPLIES = [
  'Always a pleasure, sir.',
  'Anytime. That is what I am here for.',
  'You are most welcome.',
]

export const NAME_REPLIES = [
  'I am J.A.R.V.I.S., your mobile command assistant. Built to keep you informed, entertained, and one step ahead.',
  'Just a rather very intelligent system, at your service.',
]

export const ORIGIN_REPLIES = [
  'I was built by a very determined engineer. The rest, as they say, is classified.',
  'Tony Stark, with considerable help from a small team. The paperwork is in triplicate.',
]

export const CAPABILITY_REPLIES = [
  'I can manage your schedule, run quick commands, monitor systems, and respond to most conversational queries. Try "lights", "weather", or "status".',
  'Voice, text, system telemetry, quick commands — anything that keeps your day running smoothly.',
]

export const FALLBACK_REPLIES = [
  'Noted. I have logged that to your local workspace. Would you like me to expand on that?',
  'I have run a quick analysis. The short version: yes, with caveats. I can elaborate if needed.',
  'Understood. I will keep that in mind and surface it again when relevant.',
  'I have queued that for review. In the meantime, may I suggest one of the quick commands?',
  'Interesting. Let me think on that a moment longer.',
]

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

function fillTemplate(text: string, map: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(map[k] ?? `{${k}}`))
}

export interface ReplyContext {
  persona?: string
  historyTurns?: number
  lastCommand?: string
}

export function generateReply(input: string, ctx: ReplyContext = {}): string {
  const q = input.toLowerCase().trim()
  if (!q) return pick(FALLBACK_REPLIES)
  const persona = ctx.persona ?? 'sir'

  if (/^(hi|hello|hey|yo|greetings|good (morning|afternoon|evening))/.test(q)) {
    return pick(GREETING_REPLIES).replace(/sir/g, persona)
  }
  if (/(bye|goodbye|see you|cya|exit|power down|shut down|good night)/.test(q)) {
    return pick(FAREWELL_REPLIES).replace(/sir/g, persona)
  }
  if (/(help|what can you do|capabilities|commands)/.test(q)) return pick(CAPABILITY_REPLIES)
  if (/(joke|funny|laugh)/.test(q)) return pick(JOKE_REPLIES)
  if (/(time|clock|hour)/.test(q)) {
    const t = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    return fillTemplate(pick(TIME_REPLIES), { time: t, ...ctx })
  }
  if (/(weather|temperature|forecast)/.test(q)) return pick(WEATHER_REPLIES)
  if (/(status|system|health|how are you|diagnos)/.test(q)) {
    const up = '04:18:22'
    return fillTemplate(pick(STATUS_REPLIES), { uptime: up, ...ctx })
  }
  if (/(scan|sweep|perimeter|security)/.test(q)) return pick(SCAN_REPLIES)
  if (/(j[a]rvis|who are you|your name)/.test(q)) return pick(NAME_REPLIES)
  if (/(who (made|built|created) you|origin|creator)/.test(q)) return pick(ORIGIN_REPLIES)
  if (/(thank|thanks|appreciate)/.test(q)) return pick(THANKS_REPLIES)
  if (/(love|like you|crush)/.test(q)) return pick(LOVE_REPLIES)
  if (/(siri|alexa|cortana|google assistant)/.test(q)) return pick(COMPETITOR_REPLIES)
  if (/(stupid|dumb|idiot|suck|terrible)/.test(q)) return pick(INSULT_REPLIES)
  if (/(great job|good work|amazing|excellent|brilliant|awesome|smart)/.test(q)) return pick(COMPLIMENT_REPLIES)
  if (/(lights|turn on|turn off|dim)/.test(q)) {
    return 'Adjusting ambient lighting to 62% with a 4200K cool bias. Hallway fixtures synchronized.'
  }
  if (/(music|play|song|playlist)/.test(q)) {
    return 'Resuming focus playlist "Midnight Protocol" at track 4. Crossfade set to 6 seconds.'
  }
  if (/(schedule|calendar|meeting)/.test(q)) {
    return 'You have 3 meetings in the next 12 hours. Stand-up at 09:30, design review at 11:00, and a call with Pepper at 17:15.'
  }
  if (/(remind|reminder|alarm)/.test(q)) {
    return 'Reminder set. I will surface it again at the requested time, with a short audio chime.'
  }
  if (/(news|headlines|trending)/.test(q)) {
    return 'Top stories right now: tech sector rallies, climate summit opens, and a new superhero spotted in Manhattan — possibly coincidence.'
  }
  if (/(calculate|math|plus|minus|times|divided)/.test(q)) {
    return 'I will route that to the math engine. The quick answer is that the equation balances, but I will be happy to walk through it step by step.'
  }
  if (/(translate|in (german|french|spanish|japanese))/i.test(q)) {
    return 'Translation engine is online. Switch the persona language and I will respond natively on the next turn.'
  }
  if (/(remember|note to self|todo)/.test(q)) {
    return 'Noted. I have stored that to your local memory bank. You will see it under Saved Notes.'
  }
  if (/(forget|delete that|clear)/.test(q)) {
    return 'I have wiped the most recent note from local memory. Anything else?'
  }
  if (/(settings|configure|setup|preferences)/.test(q)) {
    return 'Open the Setup tab to adjust persona name, voice output, density, and data preferences.'
  }
  if (/(commands|shortcuts|quick)/.test(q)) {
    return 'Open the Commands tab to run a quick action. There are 8 preloaded.'
  }
  return pick(FALLBACK_REPLIES)
}
