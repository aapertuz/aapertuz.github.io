import { techIcons } from '../data/techIcons'

interface Technology {
  name: string
  icon: string
}

export type ProjectTechnology = { category: string } & (Technology | { items: readonly Technology[] })

export function ProjectTechTable({ technologies, caption = 'Tech stack' }: { technologies: readonly ProjectTechnology[]; caption?: string }) {
  return (
    <table className="project-tech-table">
      <caption>{caption}</caption>
      <thead><tr><th scope="col">Category</th><th scope="col">Technology</th></tr></thead>
      <tbody>
        {technologies.map((technology) => (
          <tr key={`${technology.category}-${'items' in technology ? technology.items.map((item) => item.name).join('-') : technology.name}`}>
            <th scope="row">{technology.category}</th>
            <td><div className="project-tech-table__items">
              {('items' in technology ? technology.items : [technology]).map((item) => (
                <span key={item.name}><img src={techIcons[item.icon]} alt="" />{item.name}</span>
              ))}
            </div></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
