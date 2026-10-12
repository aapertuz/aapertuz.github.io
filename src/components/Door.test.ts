import { describe, expect, test } from 'bun:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { projects } from '../data/projects'
import { ProjectDetails } from './ProjectDetails'

describe('project doorway details', () => {
  for (const project of projects) {
    test(`preserves ${project.title} information and destination`, () => {
      const markup = renderToStaticMarkup(createElement(ProjectDetails, { project, onClose: () => {} }))
      expect(markup).toContain(project.title)
      expect(markup).toContain(project.description)
      expect(markup).toContain('Back to corridor')
      expect(markup.match(/<img /g)).toHaveLength(project.tools.length)
      if (project.link) {
        expect(markup).toContain(`href="${project.link}"`)
        expect(markup).toContain('rel="noopener noreferrer"')
      } else {
        expect(markup).toContain('Coming soon')
        expect(markup).not.toContain('<a ')
      }
    })
  }
})
