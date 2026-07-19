import { Component, type ReactNode } from 'react'
import { projects } from '../data/projects'

interface State {
  failed: boolean
}

// Plain-HTML fallback so a WebGL failure never white-screens the site.
export class SceneBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="fallback">
        <h1>
          <span>I'm</span> Lex Pertuz
        </h1>
        <ul>
          {projects.map((p) => (
            <li key={p.title}>
              <strong>{p.title}</strong> — {p.subheadline}
            </li>
          ))}
        </ul>
      </main>
    )
  }
}
