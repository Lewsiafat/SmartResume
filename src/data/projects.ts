import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'taskBoard',
    emoji: '📋',
    category: 'Full-Stack',
    tags: ['Vue 3', 'Node.js', 'WebSocket', 'PostgreSQL'],
    stats: ['📊 Kanban View', '👥 Real-time'],
    github: 'https://github.com/sample-user/taskboard-pro',
    demo: 'https://example.com/taskboard/',
  },
  {
    id: 'weatherDash',
    emoji: '🌤️',
    category: 'AI Tools',
    tags: ['Python', 'FastAPI', 'AI', 'REST API'],
    stats: ['🧠 AI-Powered', '🌍 Multi-source'],
    github: 'https://github.com/sample-user/weather-dash',
    demo: 'https://example.com/weather/',
  },
  {
    id: 'devToolkit',
    emoji: '🔧',
    category: 'Tool',
    tags: ['Python', 'CLI', 'Developer Tools'],
    stats: ['⭐ 5 Stars', '🚀 CLI-based'],
    github: 'https://github.com/sample-user/dev-toolkit',
  },
]
