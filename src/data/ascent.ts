export const ascent = {
  category: 'AI / Venture Capital',
  platform: 'Web',
  type: 'Venture Capital Collaboration',
  dimensions: [
    { icon: 'founder', label: 'Founder' },
    { icon: 'market', label: 'Market' },
    { icon: 'product', label: 'Product' },
    { icon: 'traction', label: 'Traction' },
  ],
  problem: {
    headline: 'Raising capital shouldn’t be a guessing game.',
    description: 'Founders often struggle to understand what investors are looking for and why their startups aren’t ready for funding. Meanwhile, investors spend countless hours evaluating companies, reviewing pitches, and identifying promising opportunities.',
    audiences: [
      { icon: 'founder', label: 'For founders', title: 'What should I improve?', description: 'Limited access to meaningful feedback makes it difficult to know what to improve before approaching investors.' },
      { icon: 'investor', label: 'For investors', title: 'How do I compare opportunities?', description: 'Evaluating startups requires analyzing large amounts of information, often without a consistent way to compare opportunities.' },
    ],
    goal: 'Through this collaboration, we wanted to make that process more transparent and useful for both sides.',
  },
  solution: {
    headline: 'Know where you stand. Know how to move forward.',
    description: 'Ascent combines AI evidence analysis with proprietary scoring and prediction algorithms to evaluate startups, generate projections, and estimate their likelihood of success. A simple interface makes those results accessible to founders and investors.',
    steps: [
      { icon: 'evaluate', label: 'Evaluate', title: 'Let the evidence speak.', description: 'Ascent analyzes startups across four dimensions: Founder, Market, Product, and Traction, looking beyond compelling pitches to understand their actual potential.' },
      { icon: 'direction', label: 'Improve', title: 'Turn feedback into direction.', description: 'Founders receive personalized insights into their strengths, weaknesses, and what they should prioritize to improve their investment readiness.' },
      { icon: 'connect', label: 'Connect', title: 'Create better opportunities.', description: 'Ascent aims to connect promising startups with relevant investors based on their progress, evidence, and investment potential.' },
    ],
  },
  impact: {
    headline: 'Better insights. Better investment decisions.',
    description: 'Ascent explores how AI can make startup evaluation more accessible, consistent, and actionable for both founders and investors.',
    benefits: [
      { icon: 'clarity', title: 'Clarity', description: 'Help founders understand where they stand and what investors are looking for.' },
      { icon: 'direction', title: 'Direction', description: 'Turn complex evaluations into practical recommendations for improving investment readiness.' },
      { icon: 'connect', title: 'Opportunity', description: 'Help investors discover promising startups while giving founders a clearer path toward funding.' },
    ],
  },
  tech: {
    headline: 'Proprietary algorithms, made accessible.',
    description: 'The simple interface sits on top of a proprietary startup scoring algorithm and a predictive modeling algorithm. Together, they turn startup evidence into assessments, projections, and estimates of future success.',
    engineering: [
      { icon: 'scoring', title: 'Proprietary scoring engine', description: 'An algorithm developed for Ascent scores startups across Founder, Market, Product, and Traction, translating structured evidence into comparable assessments.' },
      { icon: 'traction', title: 'Predictive modeling', description: 'A prediction algorithm generates projections and estimates the likelihood of startup success from the available evidence, giving founders and investors a view of potential outcomes.' },
      { icon: 'evidence', title: 'Evidence analysis', description: 'LLM powered analysis interprets founder and business evidence to support the evaluation workflow. The interface presents the resulting scores and insights in a form people can understand and act on.' },
    ],
  },
  journey: {
    headline: 'Turning investment expertise into software.',
    description: 'Ascent came from a collaboration with a venture capital firm that wanted to rethink how startups are evaluated and prepared for investment. The challenge was turning investment knowledge and judgment into meaningful, personalized guidance for founders.',
    milestones: [
      { label: 'The collaboration', title: 'Understanding the investor’s perspective.', description: 'Working with a venture capital firm gave me the opportunity to explore how investors assess startups, what signals matter, and how those insights could be translated into a useful product.' },
      { label: 'The design', title: 'Making complex evaluations understandable.', description: 'A score alone doesn’t tell founders much. The experience needed to explain why a startup received a particular evaluation, what was missing, and what could be improved, making sophisticated investment analysis feel simple and actionable.' },
      { label: 'The development', title: 'Turning evidence into evaluations.', description: 'We structured the evaluation around Founder, Market, Product, and Traction, combining structured assessments with AI reasoning to analyze evidence and provide feedback tailored to each startup.' },
      { label: 'The engineering', title: 'Building AI that evaluates, not just generates.', description: 'Going beyond generic AI advice meant interpreting different kinds of evidence, applying consistent criteria, and generating recommendations founders can use. The goal was for AI reasoning to support a structured evaluation process rather than replace it with subjective opinions.' },
    ],
    technicalFocus: [
      { icon: 'ai', area: 'Artificial Intelligence', focus: 'LLM powered analysis and reasoning' },
      { icon: 'evaluate', area: 'Evaluation Engine', focus: 'Structured startup assessments' },
      { icon: 'evidence', area: 'Evidence Analysis', focus: 'Interpreting business and founder evidence' },
      { icon: 'scoring', area: 'Scoring Model', focus: 'Proprietary startup scoring algorithm' },
      { icon: 'traction', area: 'Predictive Modeling', focus: 'Startup projections and estimated likelihood of success' },
      { icon: 'direction', area: 'Recommendations', focus: 'Personalized improvement guidance' },
      { icon: 'connect', area: 'Investor Discovery', focus: 'Connecting startups with relevant investors' },
    ],
    contribution: 'I collaborated with a venture capital firm to help bring Ascent’s vision to life, working at the intersection of product development, engineering, and investment analysis.',
    reflection: 'What made this project particularly interesting was understanding how venture capital professionals evaluate companies and exploring how that expertise could be translated into software.',
    takeaway: 'For me, Ascent represents something I enjoy about engineering: learning how another industry works, understanding its challenges, and building technology that makes complex processes more accessible.',
  },
} as const
