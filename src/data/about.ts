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
  name: string
  description: string
  technologies: AboutLogo[]
  links: AboutLink[]
}

export const aboutContent: AboutContent = {
  name: 'Antonio Pertuz',
  description: "I love every corner of products: design, architecture, engineering. With six years building, scaling, and helping tech companies ship their products across Latin America and the US, my mission is to drive innovation and disruption from the product layer out to impact real societies. Currently leading product at an AI telemedicine startup and building on the side.",
  technologies: [
    { label: 'React Native', icon: 'react_native' },
    { label: 'Next.js', icon: 'nextjs' },
    { label: 'Python', icon: 'python' },
    { label: 'PostgreSQL', icon: 'postgresql' },
    { label: 'FastAPI', icon: 'fastapi' },
    { label: 'Node.js', icon: 'nodejs' },
  ],
  links: [
    { label: 'Email', href: 'mailto:antonio.pertuz99@gmail.com', icon: 'mail' },
    { label: 'GitHub', href: 'https://github.com/aapertuz', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/apertuz', icon: 'linkedin' },
  ],
}
