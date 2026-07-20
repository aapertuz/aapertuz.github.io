export interface AboutLink {
  label: string
  href: string
  icon: 'mail' | 'github' | 'linkedin'
}

export interface AboutLogo {
  label: string
  mark: 'brackets' | 'cube' | 'orbit' | 'layers' | 'terminal' | 'node' | 'portal' | 'weave' | 'peak'
}

export interface AboutContent {
  eyebrow: string
  name: string
  role: string
  description: string
  technologies: AboutLogo[]
  companies: AboutLogo[]
  projects: Array<{ name: string; detail: string }>
  links: AboutLink[]
}

export const aboutContent: AboutContent = {
  eyebrow: 'ABOUT / PROFILE',
  name: 'Your Name',
  role: 'Your Role · Your Discipline',
  description: 'A short introduction about your work, interests, and approach.',
  technologies: [
    { label: 'Technology 01', mark: 'brackets' },
    { label: 'Technology 02', mark: 'cube' },
    { label: 'Technology 03', mark: 'orbit' },
    { label: 'Technology 04', mark: 'layers' },
    { label: 'Technology 05', mark: 'terminal' },
    { label: 'Technology 06', mark: 'node' },
  ],
  companies: [
    { label: 'Company 01', mark: 'portal' },
    { label: 'Company 02', mark: 'weave' },
    { label: 'Company 03', mark: 'peak' },
  ],
  projects: [
    { name: 'Project 01', detail: 'A project descriptor goes here.' },
    { name: 'Project 02', detail: 'A project descriptor goes here.' },
    { name: 'Project 03', detail: 'A project descriptor goes here.' },
  ],
  links: [
    { label: 'Email', href: 'mailto:hello@example.com', icon: 'mail' },
    { label: 'GitHub', href: 'https://example.com/github', icon: 'github' },
    { label: 'LinkedIn', href: 'https://example.com/linkedin', icon: 'linkedin' },
  ],
}
