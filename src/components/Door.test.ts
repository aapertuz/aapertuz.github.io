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
      if (['Weft', 'Polar', 'GigPilot', 'ByteForm', 'Ascent', 'EasyMD'].includes(project.title)) {
        expect(markup).toContain('<table')
        expect(markup).toContain('scope="col"')
        expect(markup).toContain('scope="row"')
      } else {
        expect(markup.match(/<img /g)).toHaveLength(project.tools.length)
      }
      if (project.link) {
        expect(markup).toContain(`href="${project.link}"`)
        expect(markup).toContain('rel="noopener noreferrer"')
      } else {
        if (project.title === 'Polar') expect(markup).toContain('In development')
        expect(markup).not.toContain('href=""')
        expect(markup).not.toContain('target="_blank"')
      }
    })
  }
})
