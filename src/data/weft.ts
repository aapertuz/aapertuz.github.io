export const weft = {
  category: 'AI / Social Networking',
  problem: {
    headline: 'The right people are in the room. They just never meet.',
    audiences: [
      { icon: 'person', title: 'For attendees', description: 'Finding the right people depends on luck, timing, and existing connections.' },
      { icon: 'room', title: 'For organizers', description: 'Bringing people together doesn’t guarantee meaningful interactions.' },
    ],
  },
  solution: {
    headline: 'Networking, orchestrated by intelligence.',
    steps: [
      { icon: 'conversation', title: 'Understand', label: 'AI assistant', description: 'Through natural conversations, the AI learns each attendee’s goals, interests, and motivations.' },
      { icon: 'match', title: 'Match', label: 'AI matchmaking', description: 'AI identifies valuable connections through shared goals, complementary interests, and context.' },
      { icon: 'connection', title: 'Connect', label: 'Wefters · Human facilitators', description: 'Wefters introduce matched attendees at physical events, turning shared intentions into real conversations.' },
    ],
  },
  impact: {
    headline: 'Real connections. Real opportunities.',
    description: 'From early experiments to live events, Weft is turning intelligent matchmaking into meaningful experiences.',
    metrics: [
      { value: '100+', label: 'Attendees', context: 'Across real events' },
      { value: '10+', label: 'Event organizers', context: 'Who have used Weft' },
      { value: '86%', label: 'Pilot satisfaction', context: 'At our pilot event' },
    ],
  },
  tech: {
    description: 'Next.js, Node.js, and FastAPI support the web experience and backend services. OpenAI powers matchmaking, while ElevenLabs and Telnyx support voice and messaging. Managed hosting, PostgreSQL, and cloud storage keep the platform running.',
    technologies: [
      { category: 'Frontend', name: 'Next.js', icon: 'nextjs' },
      { category: 'Backend', items: [
        { name: 'FastAPI', icon: 'fastapi' },
        { name: 'Node.js', icon: 'nodejs' },
      ] },
      { category: 'Voice', name: 'ElevenLabs', icon: 'elevenlabs' },
      { category: 'Voice & SMS', name: 'Telnyx', icon: 'telnyx' },
      { category: 'Backend hosting', name: 'Railway', icon: 'railway' },
      { category: 'Database', name: 'Neon PostgreSQL', icon: 'neon' },
      { category: 'Frontend hosting', name: 'Vercel', icon: 'vercel' },
      { category: 'Storage', name: 'Firebase Storage', icon: 'firebase' },
    ],
  },
  journey: {
    headline: 'From an idea to real world connections.',
    description: 'What began as shared experiences for founders evolved into a platform that makes networking more intentional.',
    milestones: [
      { label: 'The beginning', title: 'Surnx', description: 'We created shared experiences where founders could meet, collaborate, and build genuine relationships.' },
      { label: 'The discovery', title: 'Helping the right people find each other', description: 'Gathering people was only the first step. The real challenge was connecting the right people in the room.' },
      { label: 'The evolution', title: 'Building Weft', description: 'We evolved Surnx into Weft, combining AI matchmaking with human facilitated introductions.' },
      { label: 'The engineering', title: 'Bridging AI and human interactions', description: 'We worked on understanding human intent, preserving conversational context across voice and SMS, and translating matches into real introductions.' },
    ],
    contribution: 'As co-founder and COO, I worked across product strategy, engineering, operations, and business development to turn an initial concept into a product tested at real events.',
    responsibilities: ['Product strategy', 'Engineering', 'Operations', 'Business development'],
  },
} as const
