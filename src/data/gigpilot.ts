export const gigpilot = {
  category: 'AI / Freelance Productivity',
  platform: 'Terminal CLI',
  type: 'Open Source',
  problem: {
    headline: 'Finding opportunities takes more time than pursuing them.',
    description: 'As a freelancer, finding your next opportunity can feel like a job of its own.',
    obstacles: [
      { icon: 'search', title: 'Constant searching', description: 'Checking platforms for your next opportunity.' },
      { icon: 'filter', title: 'Irrelevant listings', description: 'Scrolling through projects that don’t fit.' },
      { icon: 'evaluate', title: 'Uncertain potential', description: 'Evaluating whether projects are worth your time.' },
      { icon: 'apply', title: 'Repeated effort', description: 'Writing proposals that might never get a response.' },
    ],
    motivation: 'I wanted to change that. With AI, why spend hours searching when a system could understand our skills, find relevant projects, and help us pursue the ones that make sense?',
    insight: 'The problem isn’t a lack of opportunities. It’s the time and effort it takes to find the right ones.',
  },
  solution: {
    headline: 'Your next opportunity, without the endless search.',
    description: 'GigPilot understands your professional profile, searches for relevant freelance opportunities, and helps you move from discovery to application.',
    steps: [
      { icon: 'search', label: 'Discover', title: 'Let opportunities come to you.', description: 'Search multiple sources for freelance projects that match your skills, experience, and preferences.', summary: 'Skills, experience & preferences' },
      { icon: 'evaluate', label: 'Evaluate', title: 'Know what’s worth pursuing.', description: 'AI considers relevance, budget, scope, and legitimacy so you can focus on the most promising opportunities.', summary: 'Relevance, budget, scope & legitimacy' },
      { icon: 'apply', label: 'Apply', title: 'Spend less time starting from scratch.', description: 'Generate personalized proposals from your experience and each project’s requirements. Track opportunities and applications in one place.', summary: 'Personalized proposals & application tracking' },
    ],
  },
  impact: {
    headline: 'Less searching. More opportunities.',
    description: 'GigPilot is built around a simple idea: freelancers should spend more time doing great work and less time looking for it.',
    benefits: [
      { icon: 'target', title: 'Relevance', description: 'Find opportunities that match your skills and goals instead of scrolling through endless listings.' },
      { icon: 'efficiency', title: 'Efficiency', description: 'Automate repetitive research and proposal preparation, freeing up time for the work that matters.' },
      { icon: 'storage', title: 'Control', description: 'Keep your professional data, opportunities, and application pipeline locally, without depending on another cloud platform.' },
    ],
  },
  tech: {
    headline: 'Powerful automation without complex infrastructure.',
    description: 'One of my main goals was keeping the architecture lightweight. No database, no server, and no complicated setup.',
    architecture: 'JavaScript modules handle opportunity discovery and processing, while AI handles the reasoning. YAML configurations, Markdown files, and Git keep the workflow simple and personal.',
    technologies: [
      { category: 'Backend', name: 'Node.js', icon: 'nodejs' },
      { category: 'Language', name: 'JavaScript', icon: 'javascript' },
    ],
  },
  journey: {
    headline: 'Building the assistant I wanted to have.',
    description: 'GigPilot started with a simple question: What if finding freelance work could be something an AI assistant handles for you, instead of another daily routine you have to manage?',
    milestones: [
      { label: 'The idea', title: 'Rethinking the freelance search', description: 'I wanted to go beyond job alerts and keyword filters, with an assistant that understands who you are professionally and actively searches for opportunities that make sense for you.' },
      { label: 'The design', title: 'Keeping things simple and personal', description: 'I chose a local terminal experience. Your profile, opportunities, and application history live in simple files you own and control.' },
      { label: 'The development', title: 'Building an extensible AI workflow', description: 'I designed configurable sources and AI powered workflows for discovering, filtering, evaluating, and preparing applications. New opportunity sources can be added without rebuilding the system.' },
      { label: 'The engineering', title: 'Making independent pieces work together', description: 'The interesting challenge is bringing discovery modules, AI reasoning, and file-based data together as a useful assistant, without requiring a traditional backend.' },
    ],
    contribution: 'I adapted an open source project for full time job searches into GigPilot, redesigning parts of its architecture and workflows around freelance opportunities. I built the AI workflows and terminal experience to find, evaluate, and apply to projects.',
    responsibilities: ['Concept', 'AI workflows', 'Architecture adaptation', 'Implementation'],
    experiment: 'It’s also an experiment in something I find increasingly interesting:',
    idea: 'Building useful software that doesn’t need complex infrastructure because AI can take care of much of the heavy lifting.',
  },
} as const
