import type { Skill } from '../types'

export const skills: Skill[] = [
  {
    id: 'languages',
    icon: '💻',
    items: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'],
  },
  {
    id: 'frontend',
    icon: '🎨',
    items: ['Vue 3', 'React', 'Tailwind CSS', 'Vite', 'Pinia'],
  },
  {
    id: 'backend',
    icon: '⚙️',
    items: ['Node.js', 'Express', 'FastAPI', 'PostgreSQL', 'Redis'],
  },
  {
    id: 'devops',
    icon: '🚀',
    items: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS', 'Linux'],
  },
]
