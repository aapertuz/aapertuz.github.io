export interface AboutLink {
  label: string
  href: string
}

export interface AboutContent {
  eyebrow: string
  name: string
  role: string
  description: string
  technologies: string[]
  companies: string[]
  projects: Array<{ name: string; detail: string }>
  links: AboutLink[]
}

export const aboutContent: AboutContent = {
  eyebrow: 'ABOUT / PROFILE',
  name: 'Your Name',
  role: 'Your Role · Your Discipline',
  description: 'A short introduction about your work, interests, and approach.',
  technologies: ['Technology 01', 'Technology 02', 'Technology 03', 'Technology 04', 'Technology 05', 'Technology 06'],
  companies: ['Company 01', 'Company 02', 'Company 03'],
  projects: [
    { name: 'Project 01', detail: 'A project descriptor goes here.' },
    { name: 'Project 02', detail: 'A project descriptor goes here.' },
    { name: 'Project 03', detail: 'A project descriptor goes here.' },
  ],
  links: [
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'GitHub', href: 'https://example.com/github' },
    { label: 'LinkedIn', href: 'https://example.com/linkedin' },
  ],
}
