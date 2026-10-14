export const polar = {
  category: 'AI / Productivity',
  platform: 'Desktop',
  status: 'In development',
  problem: {
    headline: 'Managing work has become work itself.',
    description: 'I was spending too much time maintaining boards, updating tickets, and tracking changes across projects. Every new decision meant going back to Jira, Notion, or another tool to keep everything aligned.',
    context: 'Larger companies have project managers to handle this. But in small teams and startups like mine, we don’t have that luxury.',
    symptoms: [
      { icon: 'plan', title: 'Outdated plans', description: 'Plans fall behind as decisions change.' },
      { icon: 'context', title: 'Scattered information', description: 'Context gets spread across tools and projects.' },
      { icon: 'adapt', title: 'Constant upkeep', description: 'We do the work to keep our tools useful.' },
    ],
    insight: 'The real problem isn’t a lack of tools. It’s that we’re doing all the work to keep them useful.',
  },
  solution: {
    headline: 'What if your workspace could keep up with you?',
    description: 'With AI, I believe we can move beyond manually managing projects. Polar is my attempt to build a workspace that understands what you’re trying to achieve, follows your progress, and evolves alongside your work.',
    steps: [
      { icon: 'mission', label: 'Define', title: 'Start with what matters.', description: 'Tell Polar what you want to accomplish, why it matters, and what success looks like. That’s your Mission.' },
      { icon: 'plan', label: 'Plan', title: 'Let the plan take shape.', description: 'Polar turns your Mission into an execution plan with Checkpoints that define meaningful progress and Actions that move you toward it.' },
      { icon: 'adapt', label: 'Adapt', title: 'Plans should evolve with reality.', description: 'Polar connects to tools like Gmail, Drive, and GitHub, then updates plans as work changes. It automatically alerts people to what needs attention and sends reminders to keep work moving, without constant manual reorganizing.' },
    ],
  },
  impact: {
    headline: 'Less managing. More building.',
    description: 'Polar is still in development, but the goal is simple: make managing work feel less like an additional responsibility and more like having someone helping you move forward.',
    benefits: [
      { icon: 'clarity', title: 'Clarity', description: 'Know what matters next without digging through endless tickets and dashboards.' },
      { icon: 'adapt', title: 'Adaptability', description: 'Keep plans aligned with what’s actually happening, not what you thought would happen weeks ago.' },
      { icon: 'focus', title: 'Focus', description: 'Spend less time maintaining your tools and more time doing the work that matters.' },
    ],
  },
  journey: {
    headline: 'Building the tool I wish I had.',
    description: 'Polar started from my own frustration with managing projects while building startups. I wanted something simpler, but more importantly, something that could understand the work instead of just storing it.',
    milestones: [
      { label: 'The idea', title: 'Questioning how we manage work', description: 'Why do we still organize work around boards, tickets, and backlogs when AI can understand goals, reason about context, and help us plan? What if we could rethink the entire experience?' },
      { label: 'The design', title: 'An operating system for work', description: 'I started designing around Missions instead of projects, Checkpoints instead of arbitrary milestones, and Actions instead of endless backlogs. All inside a minimal desktop experience inspired by operating systems.' },
      { label: 'The development', title: 'Building from the ground up', description: 'I chose Tauri and React for a lightweight desktop experience, with Rust handling native capabilities and a TypeScript backend supporting the application’s services.' },
      { label: 'The engineering', title: 'Making plans that can think and adapt', description: 'The interesting challenge isn’t generating a list of tasks. It’s understanding the goal, remembering the context, recognizing when reality changes, and helping adjust the plan without taking control away from the user. That’s the problem I’m exploring with Polar.' },
    ],
    contribution: 'Polar is a personal project where I’m responsible for everything from the original concept and product design to the architecture and implementation.',
    question: 'What software should look like when AI becomes part of how we work, rather than just another feature inside our tools.',
    responsibilities: ['Concept', 'Product design', 'Architecture', 'Implementation'],
  },
  technologies: [
    { category: 'Desktop', name: 'Tauri 2', icon: 'tauri' },
    { category: 'Frontend', name: 'React 19', icon: 'react' },
    { category: 'Language', items: [
      { name: 'Rust', icon: 'rust' },
      { name: 'TypeScript', icon: 'typescript' },
    ] },
    { category: 'Build tooling', name: 'Vite 8', icon: 'vite' },
    { category: 'Backend', items: [
      { name: 'Fastify', icon: 'fastify' },
      { name: 'Node.js', icon: 'nodejs' },
    ] },
    { category: 'Database', name: 'Neon PostgreSQL', icon: 'neon' },
  ],
} as const
