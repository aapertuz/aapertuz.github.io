export interface RoomPalette {
  base: string
  gradient: [string, string, string]
  text: string
  nameText: string
  light: string
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

export const projects: Project[] = [
  {
    index: '01',
    status: 'BUILDING',
    industry: 'MEMORY',
    title: 'Amirani',
    subheadline: 'Productivity and control over my work',
    description:
      'A memory layer for your AI coding assistant. It remembers the work already done, so you never pay to generate the same answer twice.',
    role: 'Builder',
    tools: ['Go'], // confirm
    link: '',
    room: {
      base: '#0a0a0a',
      gradient: ['#1c1c1c', '#0e0e0e', '#00000000'],
      text: '#b4b4b4',
      nameText: '#ffffff',
      light: '#7d7d7d',
    },
  },
  {
    index: '02',
    status: 'SHIPPING',
    industry: 'WORK',
    title: 'GigPilot',
    subheadline: 'The right work, found for me',
    description:
      'Finds gigs matched to your profile, scores each one honestly, and helps you apply. The hunt runs itself.',
    role: 'Builder',
    tools: ['JavaScript', 'Next.js', 'Node.js'],
    link: 'https://github.com/alexpertuz/gig-pilot',
    room: {
      base: '#1626c9',
      gradient: ['#2036e6', '#1626c9', '#0d1a99'],
      text: '#cdd3ff',
      nameText: '#ffffff',
      light: '#6f82ff',
    },
  },
  {
    index: '03',
    status: 'SHIPPING',
    industry: 'SOCIAL',
    title: 'Weft',
    subheadline: 'A network built on values, not access',
    description:
      'Matches small groups of professionals by what they actually value. Know people worth knowing, without already knowing someone.',
    role: 'Cofounder, COO',
    tools: ['React Native', 'Python', 'PostgreSQL', 'Pinecone'],
    link: 'https://www.weftnow.com',
    room: {
      base: '#f26a0a',
      gradient: ['#ff9a3d', '#f26a0a', '#b34700'],
      text: '#ffe4cc',
      nameText: '#ffffff',
      light: '#ffae67',
    },
  },
  {
    index: '04',
    status: 'CLIMBING',
    industry: 'FINTECH',
    title: 'Ascent',
    subheadline: 'Funded for merit, not pedigree',
    description:
      'Capital intelligence that scores signal, not pedigree. Your metrics become your last name.',
    role: 'Cofounder',
    tools: ['Python', 'React', 'Vite', 'PostgreSQL', 'MCP'],
    link: 'https://weascent.co',
    room: {
      base: '#12a657',
      gradient: ['#35d17c', '#12a657', '#0a7a3d'],
      text: '#d6ffe7',
      nameText: '#ffffff',
      light: '#6bea9d',
    },
  },
  {
    index: '05',
    status: 'LIVE',
    industry: 'SAAS',
    title: 'ByteForm',
    subheadline: 'Forms that talk back',
    description:
      'Everything Typeform does, for less. Plus onboarding that runs as an AI voice call or an AI chat.',
    role: 'Builder',
    tools: ["Next.js", "JavaScript", "PostgreSQL"],
    link: 'https://github.com/alexpertuz/ByteForm',
    room: {
      base: '#b62d3d',
      gradient: ['#e05a64', '#b62d3d', '#681721'],
      text: '#ffdce0',
      nameText: '#ffffff',
      light: '#ff929a',
    },
  },
  {
    index: '06',
    status: 'SHIPPING',
    industry: 'FINTECH',
    title: 'Agendamax',
    subheadline: 'Every message answered, every slot filled',
    description:
      'An AI that books appointments on the WhatsApp number your clients already use. No app to learn, no bookings lost.',
    role: 'Builder',
    tools: ['Python', 'FastAPI', 'Supabase', 'WhatsApp Business API', 'Google Calendar API', 'Claude API', 'Redis'],
    link: 'https://github.com/alexpertuz/agendamax',
    room: {
      base: '#7442c8',
      gradient: ['#a978f2', '#7442c8', '#432477'],
      text: '#eadfff',
      nameText: '#ffffff',
      light: '#c7a4ff',
    },
  },
]
