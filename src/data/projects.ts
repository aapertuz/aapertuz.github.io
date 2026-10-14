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
  story: {
    problem: string
    solution: string
    impact: string
    journey: string
  }
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
    subheadline: 'Work should move forward, not just get organized.',
    description:
      'Polar is an AI powered Work OS I’m building to help teams turn goals into actionable plans, adapt as things change, and focus on what actually moves them forward.',
    story: {
      problem: 'Managing work has become work itself. In small teams like mine, maintaining boards, updating tickets, and tracking changes means less time for the work that matters.',
      solution: 'Polar turns Missions into Checkpoints and Actions, helping plans evolve alongside the work.',
      impact: 'Polar is still in development. The goal is greater clarity, adaptability, and focus, with less time spent maintaining tools.',
      journey: 'Born from my own frustration with managing projects while building startups, Polar is my attempt to build a workspace that understands the work instead of just storing it.',
    },
    role: 'Founder & Engineer',
    tools: ['tauri', 'rust', 'react', 'typescript', 'vite', 'fastify', 'nodejs', 'neon'],
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
    subheadline: 'Finding work shouldn’t be a full time job.',
    description:
      'GigPilot is an AI powered freelance assistant I built to help freelancers discover relevant opportunities, evaluate their potential, and create personalized proposals, all from a simple terminal interface.',
    story: {
      problem: 'The problem isn’t a lack of opportunities. It’s the time and effort it takes to find the right ones.',
      solution: 'GigPilot understands your professional profile, searches for relevant freelance opportunities, and helps you move from discovery to application.',
      impact: 'Freelancers should spend more time doing great work and less time looking for it, with relevant opportunities, automated research, and local control of their data.',
      journey: 'I adapted an open source project for full time job searches into GigPilot, redesigning parts of its architecture and workflows around freelance opportunities.',
    },
    role: 'Creator & Engineer',
    tools: ['nodejs', 'javascript'],
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
    subheadline: "Meaningful connections don’t happen by accident.",
    description:
      'An AI-powered event networking platform that matches people by goals and values, helping them make meaningful connections at events.',
    story: {
      problem: 'Networking events bring people together, but finding the right person still depends on luck, timing, and existing connections.',
      solution: 'Weft combines AI matchmaking with human facilitation to turn shared intentions into real conversations.',
      impact: '100+ attendees, 10+ event organizers, and 86% satisfaction at our pilot event.',
      journey: 'From Surnx’s shared founder experiences to Weft’s AI matchmaking and human facilitated introductions at real events.',
    },
    role: 'Co-founder & COO',
    tools: ['nextjs', 'nodejs', 'fastapi', 'elevenlabs', 'telnyx', 'railway', 'neon', 'vercel', 'firebase'],
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
    industry: 'AI / Venture Capital',
    title: 'Ascent',
    subheadline: 'Every great startup deserves a fair shot at funding.',
    description:
      'Ascent is an AI powered platform developed in collaboration with a venture capital firm to evaluate startups based on evidence, provide personalized guidance, and connect promising founders with investors.',
    story: {
      problem: 'Founders struggle to understand what investors are looking for, while investors lack a consistent way to compare opportunities.',
      solution: 'Ascent evaluates Founder, Market, Product, and Traction to turn startup evidence into personalized guidance and better investment opportunities.',
      impact: 'Ascent explores how AI can make startup evaluation more accessible, consistent, and actionable for founders and investors.',
      journey: 'Developed in collaboration with a venture capital firm, Ascent translates investment expertise into structured evaluations and meaningful guidance for founders.',
    },
    role: 'Product & Engineering',
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
    industry: 'FORMS',
    title: 'ByteForm',
    subheadline: 'Forms that actually feel like conversations.',
    description:
      'ByteForm is an open source form builder designed to turn traditional forms into natural, engaging conversations through chat and voice.',
    story: {
      problem: 'We shouldn’t have to choose between collecting structured data and having a natural conversation.',
      solution: 'ByteForm turns questions into a conversation that feels natural, whether you’re typing or speaking.',
      impact: 'Collecting information shouldn’t feel like a chore. ByteForm is built around engagement, flexibility, and simplicity.',
      journey: 'ByteForm is a personal project exploring the product design and engineering behind more natural ways of collecting information.',
    },
    role: 'Creator & Engineer',
    tools: ['nextjs', 'nodejs', 'postgresql', 'elevenlabs'],
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
    subheadline: 'From fragile code to a better experience.',
    description:
      'EasyMD is a telemedicine startup connecting patients with healthcare professionals. I led the reengineering and redesign of its mobile app, transforming a buggy, difficult to maintain codebase into a more reliable, scalable, and intuitive experience.',
    story: {
      problem: 'Years of technical debt made the architecture difficult to maintain, while recurring bugs and confusing interactions frustrated patients and slowed development.',
      solution: 'Reengineered the React Native codebase, improved performance and reliability, and redesigned the mobile experience around what patients actually needed.',
      impact: 'A more stable experience for patients and a cleaner architecture that makes the product easier to maintain and evolve.',
      journey: 'Progressively improved an existing application with real users and ongoing development, strengthening its foundations without disrupting the people depending on it.',
    },
    role: 'Mobile Product Lead',
    tools: ['react_native', 'expo', 'typescript', 'javascript', 'circleci'],
    link: '',
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
