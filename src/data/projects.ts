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
  discipline: string
  title: string
  subheadline: string
  description: string
  role: string
  room: RoomPalette
  url?: string
}

export const projects: Project[] = [
  {
    index: '01',
    status: 'BUILDING',
    discipline: 'MEMORY',
    title: 'Omoi',
    subheadline: 'Productivity and control over my work',
    description:
      'A memory layer for your AI coding assistant. It remembers the work already done, so you never pay to generate the same answer twice.',
    role: 'Builder',
    room: {
      base: '#17150f',
      gradient: ['#262019', '#141310', '#05040300'],
      text: '#c9c3b2',
      nameText: '#f4efe4',
      light: '#d8c9a8',
    },
  },
  {
    index: '02',
    status: 'SHIPPING',
    discipline: 'WORK',
    title: 'GigPilot',
    subheadline: 'The right work, found for me',
    description:
      'Finds gigs matched to your profile, scores each one honestly, and helps you apply. The hunt runs itself.',
    role: 'Builder',
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
    discipline: 'CONNECTION',
    title: 'Weft',
    subheadline: 'A network built on values, not access',
    description:
      'Professional connection woven on values, not access. Know people worth knowing, without already knowing someone.',
    role: 'Cofounder, COO',
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
    discipline: 'CAPITAL',
    title: 'Ascent',
    subheadline: 'Funded for merit, not pedigree',
    description:
      'Capital intelligence that scores signal, not pedigree. Your metrics become your last name.',
    role: 'Cofounder',
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
    status: 'COMING SOON',
    discipline: 'EXPERIMENT',
    title: 'Project Five',
    subheadline: 'A new room is taking shape',
    description:
      'An upcoming project. The work is underway; details will appear when it is ready to share.',
    role: 'In progress',
    room: {
      base: '#7442c8',
      gradient: ['#a978f2', '#7442c8', '#432477'],
      text: '#eadfff',
      nameText: '#ffffff',
      light: '#c7a4ff',
    },
  },
  {
    index: '06',
    status: 'COMING SOON',
    discipline: 'EXPERIMENT',
    title: 'Project Six',
    subheadline: 'Another door is being built',
    description:
      'An upcoming project. Its shape is still changing, so this room is holding the space for it.',
    role: 'In progress',
    room: {
      base: '#b62d3d',
      gradient: ['#e05a64', '#b62d3d', '#681721'],
      text: '#ffdce0',
      nameText: '#ffffff',
      light: '#ff929a',
    },
  },
]
