export interface Project {
  title: string
  subheadline: string
  url?: string
}

// Edit this file to update the site's content — nothing else needs to change.
export const projects: Project[] = [
  { title: 'Aurora', subheadline: 'Realtime data visualization platform' },
  { title: 'Ledgerline', subheadline: 'Personal finance, beautifully simple' },
  { title: 'Nightwatch', subheadline: 'Uptime monitoring for small teams' },
  { title: 'Papertrail', subheadline: 'Notes that organize themselves' },
  { title: 'Signalbox', subheadline: 'Event streaming made approachable' },
  { title: 'Wayfinder', subheadline: 'Trip planning with friends' },
  { title: 'Forge', subheadline: 'CI pipelines without the YAML' },
  { title: 'Lumen', subheadline: 'A calmer reading experience' },
]
