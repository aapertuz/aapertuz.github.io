export const byteform = {
  category: 'Developer Tools / Forms',
  platform: 'Web',
  type: 'Open Source',
  problem: {
    headline: 'Nobody enjoys filling out forms.',
    description: 'Forms are everywhere. We use them to sign up, apply for things, give feedback, and share information. Yet most of them still feel like paperwork: endless fields, dropdowns, and questions that don’t always make sense.',
    motivation: 'I’ve always found it strange that we spend so much time making digital experiences feel human, but when we need information from someone, we hand them a list of boxes to fill out.',
    insight: 'We shouldn’t have to choose between collecting structured data and having a natural conversation.',
  },
  solution: {
    headline: 'Less filling out. More talking.',
    description: 'ByteForm explores a different way to collect information. Instead of making people work through a form, it turns questions into a conversation that feels natural, whether you’re typing or speaking.',
    steps: [
      { icon: 'form', label: 'Create', title: 'Build once, use it your way.', description: 'Create forms with the questions, fields, and information you need, without being locked into a single experience.' },
      { icon: 'chat', label: 'Converse', title: 'Let the conversation flow.', description: 'Turn traditional questions into an interactive chat that guides people through the form, one response at a time.' },
      { icon: 'voice', label: 'Speak', title: 'Sometimes talking is easier.', description: 'Let people answer using their voice, making the experience more natural and accessible.' },
    ],
  },
  impact: {
    headline: 'Better conversations. Better experiences.',
    description: 'ByteForm is built around a simple idea: collecting information shouldn’t feel like a chore.',
    benefits: [
      { icon: 'engagement', title: 'Engagement', description: 'Make forms feel less like paperwork and more like something people actually want to complete.' },
      { icon: 'flexibility', title: 'Flexibility', description: 'Give people different ways to respond, from traditional fields to chat and voice.' },
      { icon: 'simplicity', title: 'Simplicity', description: 'Make information collection easier for the people building forms and the people answering them.' },
    ],
  },
  tech: {
    headline: 'Flexible interactions, structured underneath.',
    description: 'ByteForm separates reusable form definitions from the experience people use to answer them, supporting chat and voice while preserving validation and structured responses.',
    stack: [
      { category: 'Frontend', name: 'Next.js', icon: 'nextjs' },
      { category: 'Backend', name: 'Node.js', icon: 'nodejs' },
      { category: 'Database', name: 'PostgreSQL', icon: 'postgresql' },
      { category: 'Voice', name: 'ElevenLabs', icon: 'elevenlabs' },
    ],
  },
  journey: {
    headline: 'Rethinking something we use every day.',
    description: 'ByteForm started with a question: Why are forms still so rigid when the way we interact with technology has changed so much?',
    milestones: [
      { label: 'The idea', title: 'What if forms felt human?', description: 'I wanted to explore what happens when we stop treating forms as a collection of input fields and start thinking of them as conversations.', detail: 'The information we need doesn’t change. But the experience of providing it can be completely different.' },
      { label: 'The design', title: 'One form, different experiences.', description: 'I explored how the same form could exist as a traditional interface, a conversational chat, or a voice interaction.', detail: 'The challenge was making each experience feel natural without losing the structure that makes forms useful.' },
      { label: 'The development', title: 'Building around flexibility.', description: 'I approached ByteForm as an open source form builder, separating how questions are defined from how people interact with them.', detail: 'That opens the door to different interfaces without having to rebuild the underlying form every time.' },
      { label: 'The engineering', title: 'Making conversations work like forms.', description: 'The interesting challenge is translating structured fields into natural interactions while preserving validation, required information, and consistent responses.', detail: 'Voice adds another dimension. People don’t always answer in the expected format, so the experience needs to accommodate natural responses without making data collection unreliable.' },
    ],
    contribution: 'ByteForm is a personal project where I’m exploring the product design and engineering behind more natural ways of collecting information.',
    reflection: 'It’s also an opportunity to rethink something we usually take for granted:',
    idea: 'Just because a digital interaction has always worked a certain way doesn’t mean it’s the best way to do it.',
  },
} as const
