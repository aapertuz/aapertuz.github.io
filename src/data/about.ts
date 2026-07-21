import type { techIcons } from './techIcons'

export interface AboutLink {
  label: string
  href: string
  icon: 'mail' | 'github' | 'linkedin'
}

export interface AboutLogo {
  label: string
  icon: keyof typeof techIcons
}

export interface AboutContent {
  eyebrow: string
  name: string
  role: string
  description: string
  technologies: AboutLogo[]
  companies: Array<{ name: string; detail: string }>
  links: AboutLink[]
}

export const aboutContent: AboutContent = {
  eyebrow: 'ABOUT / PROFILE',
  name: 'Antonio',
  role: 'Head of Product · Software Engineer',
  description: "I love every corner of products: design, architecture, engineering. With six years building, scaling, and helping tech companies ship their products across Latin America and the US, my mission is to drive innovation and disruption from the product layer out to impact real societies. Currently leading product at an AI telemedicine startup and building on the side.",
  technologies: [
    { label: 'React Native', icon: 'react_native' },
    { label: 'React.js', icon: 'react' },
    { label: 'Python', icon: 'python' },
    { label: 'Supabase', icon: 'supabase' },
    { label: 'FastAPI', icon: 'fastapi' },
    { label: 'Node.js', icon: 'nodejs' },
  ],
  companies: [
    { name: 'easymd', detail: 'Head of Product at a telemedicine startup connecting patients with doctors across Latin America.' },
    { name: 'Agendapro', detail: 'Senior Mobile Engineer and Product Lead at a scheduling platform for clinics, salons, and service businesses.' },
  ],
  links: [
    { label: 'Email', href: 'mailto:hello@example.com', icon: 'mail' },
    { label: 'GitHub', href: 'https://example.com/github', icon: 'github' },
    { label: 'LinkedIn', href: 'https://example.com/linkedin', icon: 'linkedin' },
  ],
}
