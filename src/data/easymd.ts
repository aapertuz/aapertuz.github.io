export const easymd = {
  category: 'HealthTech / Telemedicine',
  platform: 'iOS & Android',
  focus: 'Reengineering, Performance & UX',
  problem: {
    headline: 'When the code becomes the bottleneck.',
    description: 'When I started working on EasyMD, the app had accumulated years of technical debt. The architecture was difficult to maintain, bugs kept appearing, and even small changes could introduce new problems.',
    context: 'The product had real potential, but the codebase was holding it back. The interface felt outdated, and some user flows were unnecessarily complicated.',
    insight: 'The challenge wasn’t just fixing bugs. It was making the product something we could confidently keep building on.',
    audiences: [
      { icon: 'patient', title: 'For users', description: 'Crashes, inconsistent behavior, and confusing interactions made accessing healthcare more frustrating than it needed to be.' },
      { icon: 'team', title: 'For the team', description: 'A tightly coupled codebase made development slower, debugging harder, and every new feature riskier to implement.' },
    ],
  },
  solution: {
    headline: 'Rebuilding the foundation, rethinking the experience.',
    description: 'Instead of continuing to patch problems as they appeared, I focused on fixing what was causing them: reworking the architecture, improving performance, and redesigning the experience around what patients actually needed.',
    steps: [
      { icon: 'architecture', label: 'Reengineer', summary: 'A maintainable foundation', title: 'A foundation built to scale.', description: 'Restructured the React Native codebase into a more modular, maintainable architecture, making features easier to develop, test, and extend.' },
      { icon: 'performance', label: 'Optimize', summary: 'A more stable application', title: 'Make reliability the standard.', description: 'Addressed recurring bugs, improved performance, and refined critical application flows to create a faster, more stable experience.' },
      { icon: 'experience', label: 'Redesign', summary: 'A clearer patient experience', title: 'Healthcare should feel effortless.', description: 'Redesigned the mobile experience with clearer navigation, more intuitive interactions, and a cleaner visual language that makes accessing healthcare simpler.' },
    ],
  },
  redesign: {
    headline: 'A clearer path to care.',
    description: 'Selected examples from the broader mobile app redesign, showing a calmer visual language and clearer next steps.',
    screens: [
      {
        id: 'home', label: 'Home',
        before: '/worlds/easymd-home-old.jpg', after: '/worlds/easymd-home-new.webp',
        beforeNote: 'Colorful tiles compete for attention across services and consultations.',
        afterNote: 'Immediate care leads the page, followed by grouped services and quick actions.',
      },
      {
        id: 'initial', label: 'Welcome',
        before: '/worlds/easymd-initial-old.jpg', after: '/worlds/easymd-initial-new.webp',
        beforeNote: 'A large illustration shares the screen with several account actions.',
        afterNote: 'A quieter introduction puts one primary action in focus, with sign-in below.',
      },
      {
        id: 'doctor', label: 'Doctor profile',
        before: '/worlds/easymd-doctor-old.jpg', after: '/worlds/easymd-doctor-new.webp',
        beforeNote: 'Basic specialist details and an address sit above a separate booking button.',
        afterNote: 'A structured profile brings the bio, specialties, and credentials together with a visible booking action.',
      },
    ],
  },
  impact: {
    headline: 'A better product, built on a stronger foundation.',
    description: 'The work focused on improving two things at once: the experience patients have today and the team’s ability to keep improving the product tomorrow.',
    // Supplied numerical examples are illustrative. Use qualitative impact until results are verified.
    outcomes: [
      { icon: 'reliability', title: 'Reliability', description: 'A more stable experience with fewer interruptions during important healthcare interactions.' },
      { icon: 'architecture', title: 'Maintainability', description: 'A cleaner architecture that makes debugging, implementing features, and evolving the product easier.' },
      { icon: 'experience', title: 'Experience', description: 'A modernized interface that reduces friction and makes the app more intuitive for patients.' },
    ],
  },
  tech: {
    headline: 'Rearchitecting the mobile experience.',
    description: 'I rearchitected the React Native app around modular responsibilities, cache lifecycle management, and asynchronous background jobs to support a responsive interface and smoother voice and video calls across iOS and Android.',
    engineering: [
      { icon: 'architecture', title: 'Modular architecture', description: 'Applied separation of concerns to decouple interface code, application logic, and data access. Clear module boundaries reduced coupling and made features easier to maintain and extend.' },
      { icon: 'cache', title: 'Cache lifecycle management', description: 'Managed cached application data and refresh lifecycles to reduce redundant network requests and keep frequently used data available without repeatedly blocking the interface on a fetch.' },
      { icon: 'calling', title: 'Asynchronous job orchestration', description: 'Coordinated background jobs around voice and video call workflows, keeping noncritical processing outside the interactive path so call controls and the consultation experience stay responsive.' },
    ],
    technologies: [
      { category: 'Mobile', items: [
        { name: 'React Native', icon: 'react_native' },
        { name: 'Expo', icon: 'expo' },
      ] },
      { category: 'Language', items: [
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'JavaScript', icon: 'javascript' },
      ] },
      { category: 'CI/CD', name: 'CircleCI', icon: 'circleci' },
    ],
  },
  journey: {
    headline: 'Sometimes the best way forward is rebuilding what’s already there.',
    description: 'I was stepping into an existing application with real users, ongoing development, and years of accumulated decisions. The challenge was improving everything underneath without disrupting the people already depending on it.',
    milestones: [
      { label: 'The assessment', title: 'Understanding what was broken.', description: 'I studied the existing codebase, identified recurring issues, and mapped the parts of the architecture that were slowing us down. I wanted to solve the underlying problems rather than keep adding temporary fixes.' },
      { label: 'The reengineering', title: 'Making the codebase manageable again.', description: 'I separated responsibilities, improved code organization, and reduced dependencies between features. The goal was to make the code easier to understand, safer to change, and ready to grow.' },
      { label: 'The redesign', title: 'Making the experience feel as good as it should.', description: 'Alongside the technical improvements, I redesigned the interface to feel modern, consistent, and intuitive. Healthcare is an area where people shouldn’t have to struggle with technology.' },
      { label: 'The engineering', title: 'Improving a product without stopping its evolution.', description: 'I balanced technical improvements with ongoing development, progressively improving the architecture while keeping the application functional. I also improved development workflows, reliability, and the foundations needed to maintain consistent quality.' },
    ],
    contribution: 'As Mobile Product Lead, I drove the technical improvements and redesign of EasyMD’s mobile application. My work went beyond fixing individual issues: making the application more reliable for patients, easier to maintain for developers, and better prepared for the startup’s growth.',
    reflection: 'EasyMD reminded me that great engineering isn’t always about building something new. Sometimes it’s about taking something that already exists, understanding why it struggles, and making it work the way it should.',
  },
} as const
