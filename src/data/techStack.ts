import type { TechCategory } from '../types'

export const techCategories: TechCategory[] = [
  {
    id: 'languages',
    icon: '💻',
    items: ['Python (Expert)', 'TypeScript (Advanced)', 'JavaScript (Advanced)', 'MicroPython (Intermediate)', 'Shell Scripting'],
  },
  {
    id: 'frameworks',
    icon: '🎨',
    items: ['Vue.js 3', 'Flask / FastAPI', 'TailwindCSS', 'Bootstrap', 'Vite'],
  },
  {
    id: 'tools',
    icon: '🔧',
    items: ['Git & GitHub', 'GitHub Actions', 'VS Code', 'Linux/Unix CLI', 'Raspberry Pi'],
  },
  {
    id: 'specializations',
    icon: '🎯',
    items: ['Technical Analysis', 'Embedded Systems', 'AI/LLM Integration', 'REST API Design', 'Real-time Systems'],
  },
]
