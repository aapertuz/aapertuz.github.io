export interface RoomPalette {
  base: string
  gradient: [string, string, string]
  text: string
  nameText: string
  light: string
  frame: string
  spill: {
    opacity: number
    width: number
    length: number
    falloff: number
    lightIntensity: number
  }
}

export interface Project {
  index: string
  status: string
  industry: string
  title: string
  subheadline: string
  description: string
  role: string
  room: RoomPalette
  url?: string
  tools: string[]
  link: string
}

const doorOrder = ['Weft', 'Polar', 'EasyMD', 'GigPilot', 'Ascent', 'ByteForm']

export const projects: Project[] = ([
  {
    index: '02',
    status: 'BUILDING',
    industry: 'WORK OS',
    title: 'Polar',
    subheadline: 'Productivity and control over my work',
    description:
      'A memory layer for your AI coding assistant. It remembers the work already done, so you never pay to generate the same answer twice.',
    role: 'Builder',
    tools: ['go'], // confirm
    link: '',
    room: {
      base: '#310910',
      gradient: ['#ed3528', '#8d1018', '#25070d'],
      text: '#ffd1cd',
      nameText: '#fff5f3',
      light: '#ff382d',
      frame: '#3a1115',
      spill: { opacity: 0.56, width: 1.45, length: 5.2, falloff: 1.05, lightIntensity: 8 },
    },
  },
  {
    index: '04',
    status: 'SHIPPING',
    industry: 'AI Freelancing',
    title: 'GigPilot',
    subheadline: 'The right work, found for me',
    description:
      'Finds gigs matched to your profile, scores each one honestly, and helps you apply. The hunt runs itself.',
    role: 'Builder',
    tools: ['javascript', 'nextjs', 'nodejs'],
    link: 'https://github.com/alexpertuz/gig-pilot',
    room: {
      base: '#17191c',
      gradient: ['#d7dbe0', '#60666e', '#1b1e22'],
      text: '#e1e4e7',
      nameText: '#ffffff',
      light: '#bdc4cb',
      frame: '#34393f',
      spill: { opacity: 0.58, width: 1.6, length: 5.8, falloff: 0.92, lightIntensity: 10 },
    },
  },
  {
    index: '01',
    status: 'SHIPPING',
    industry: 'SOCIAL',
    title: 'Weft',
    subheadline: 'A network built on values, not access',
    description:
      'Matches small groups of professionals by what they actually value. Know people worth knowing, without already knowing someone.',
    role: 'Cofounder, COO',
    tools: ['react_native', 'python', 'postgresql', 'pinecone'],
    link: 'https://www.weftnow.com',
    room: {
      base: '#f26a0a',
      gradient: ['#ff9a3d', '#f26a0a', '#b34700'],
      text: '#ffe4cc',
      nameText: '#ffffff',
      light: '#ff9a35',
      frame: '#54250b',
      spill: { opacity: 0.56, width: 1.5, length: 5.5, falloff: 1.0, lightIntensity: 8 },
    },
  },
  {
    index: '05',
    status: 'CLIMBING',
    industry: 'FINTECH',
    title: 'Ascent',
    subheadline: 'Funded for merit, not pedigree',
    description:
      'Capital intelligence that scores signal, not pedigree. Your metrics become your last name.',
    role: 'Cofounder',
    tools: ['python', 'react', 'vite', 'postgresql', 'mcp'],
    link: 'https://weascent.co',
    room: {
      base: '#12a657',
      gradient: ['#35d17c', '#12a657', '#0a7a3d'],
      text: '#d6ffe7',
      nameText: '#ffffff',
      light: '#35d878',
      frame: '#123b2c',
      spill: { opacity: 0.54, width: 1.45, length: 5.3, falloff: 1.08, lightIntensity: 8 },
    },
  },
  {
    index: '06',
    status: 'LIVE',
    industry: 'SAAS',
    title: 'ByteForm',
    subheadline: 'Forms that talk back',
    description:
      'Everything Typeform does, for less. Plus onboarding that runs as an AI voice call or an AI chat.',
    role: 'Builder',
    tools: ["nextjs", "javascript", "postgresql"],
    link: 'https://github.com/alexpertuz/ByteForm',
    room: {
      base: '#2a103d',
      gradient: ['#bf66f4', '#7b29b0', '#32104a'],
      text: '#efd9ff',
      nameText: '#ffffff',
      light: '#c574f2',
      frame: '#39184e',
      spill: { opacity: 0.55, width: 1.4, length: 5.1, falloff: 1.12, lightIntensity: 8 },
    },
  },
  {
    index: '03',
    status: 'SHIPPING',
    industry: 'HEALTH',
    title: 'EasyMD',
    subheadline: 'Every message answered, every slot filled',
    description:
      'An AI that books appointments on the WhatsApp number your clients already use. No app to learn, no bookings lost.',
    role: 'Builder',
    tools: ['python', 'fastapi', 'supabase', 'whatsapp_business_api', 'google_calendar_api', 'claude_api', 'redis'],
    link: 'https://github.com/alexpertuz/agendamax',
    room: {
      base: '#082a4f',
      gradient: ['#49a6ff', '#176bc5', '#092241'],
      text: '#d4e9ff',
      nameText: '#f5fbff',
      light: '#53a9ff',
      frame: '#153755',
      spill: { opacity: 0.56, width: 1.45, length: 5.2, falloff: 1.06, lightIntensity: 8 },
    },
  },
] satisfies Project[]).sort((a, b) => doorOrder.indexOf(a.title) - doorOrder.indexOf(b.title))
