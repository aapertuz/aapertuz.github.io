export interface ProjectShowcaseContent {
  headline: string
  description?: string
  layout: 'wide' | 'gallery'
  screens: readonly {
    id: string
    label: string
    src: string
    alt: string
    width: number
    height: number
    media?: 'video'
    details: readonly { title: string; description: string; x?: number; y?: number }[]
  }[]
}

export const projectShowcases = {
  ByteForm: {
    headline: 'One form. Three ways to respond.',
    layout: 'wide',
    screens: [{
      id: 'builder', label: 'Form builder demo', src: '/worlds/byteform-demo.webm', media: 'video', width: 1280, height: 762,
      alt: 'ByteForm demo showing question creation, field configuration, form previews, and publishing',
      details: [
        { title: 'Build it as usual', description: 'Add questions, choose field types, and configure required answers just like in any normal form builder.' },
        { title: 'Get three experiences', description: 'Make the same form available as voice, conversational chat, and an elegant Typeform-style experience.' },
        { title: 'Publish and share', description: 'Share the experience that suits your respondents, with one set of questions to maintain.' },
      ],
    }],
  },
  Weft: {
    headline: 'From a conversation to the right connection.',
    description: 'Selected views of Kami’s attendee conversations and the organizer tools that turn shared goals into meaningful introductions.',
    layout: 'gallery',
    screens: [
      {
        id: 'kami', label: 'Kami', src: '/worlds/weft-imessage.webp', width: 853, height: 1844,
        alt: 'Kami, Weft’s AI, sharing attendee matches in iMessage and explaining why a suggested connection is relevant',
        details: [
          { title: 'No app to download', description: 'Kami, Weft’s AI, texts attendees in the messaging apps they already use or calls their phone numbers directly.', x: 82, y: 11 },
          { title: 'Matches with a reason', description: 'Kami shares people based on goals and interests, then explains why a connection makes sense.', x: 80, y: 36 },
          { title: 'Keep the conversation going', description: 'Attendees can ask follow-up questions and request introductions in the same conversation.', x: 80, y: 63 },
        ],
      },
      {
        id: 'people', label: 'People', src: '/worlds/weft-people.webp', width: 1536, height: 1024,
        alt: 'Weft people directory with attendee filters, goals, and a profile showing event history and previous connections',
        details: [
          { title: 'Know the room', description: 'Search and filter attendees by role, participation, and what they want to achieve.', x: 15, y: 38 },
          { title: 'Keep the context', description: 'A profile brings each person’s goals and current event participation into view.', x: 98, y: 30 },
          { title: 'Build on past connections', description: 'Event history and previous introductions help organizers see the relationship beyond a single event.', x: 98, y: 68 },
        ],
      },
      {
        id: 'network', label: 'Network', src: '/worlds/weft-networking.webp', width: 893, height: 1536,
        alt: 'Weft network view with suggested introductions, a relationship explorer, network composition, and returning attendees',
        details: [
          { title: 'Find the next introduction', description: 'Suggested pairs explain why two people should meet and offer a way to plan the introduction.', x: 98, y: 18 },
          { title: 'Explore relationships', description: 'The network explorer shows who a person has met and the events they share.', x: 51, y: 45 },
          { title: 'Understand the community', description: 'Network composition and returning attendees give organizers a broader view of their ecosystem.', x: 98, y: 45 },
        ],
      },
    ],
  },
  Polar: {
    headline: 'The mission. The context. The next move.',
    description: 'A look inside the desktop workspace I’m building, with a mission overview, the decisions that need attention, and a timeline of upcoming actions.',
    layout: 'wide',
    screens: [{
      id: 'workspace', label: 'Mission workspace', src: '/worlds/polar-home.webp', width: 3018, height: 1884,
      alt: 'Polar desktop workspace showing a shared mission, an attention prompt, checkpoint progress, and an upcoming action timeline',
      details: [
        { title: 'Start with the mission', description: 'Keep the goal and its intended outcome visible in a shared workspace.', x: 19, y: 24 },
        { title: 'Surface what needs attention', description: 'Bring an unresolved decision forward with the context needed to move it along.', x: 70, y: 55 },
        { title: 'See what comes next', description: 'A timeline keeps upcoming actions, priorities, and responsibilities in view.', x: 97, y: 23 },
      ],
    }],
  },
  Ascent: {
    headline: 'Make the evaluation understandable.',
    description: 'An example evaluation report from a simple interface backed by Ascent’s proprietary startup scoring and prediction algorithms.',
    layout: 'wide',
    screens: [{
      id: 'report', label: 'Evaluation report', src: '/worlds/ascent-report.webp', width: 2912, height: 1724,
      alt: 'Ascent evaluation report showing an evidence score, dimension navigation, a factor chart, and a score breakdown',
      details: [
        { title: 'See where you stand', description: 'An overall evidence score and assessment status give founders a starting point.', x: 78, y: 19 },
        { title: 'Explore each dimension', description: 'Founder, Market, and Product & Traction organize the assessment into focused areas.', x: 20, y: 28 },
        { title: 'Look beneath the score', description: 'Factor evidence and a dimension breakdown show how the evaluation takes shape.', x: 69, y: 62 },
      ],
    }],
  },
} satisfies Record<string, ProjectShowcaseContent>
