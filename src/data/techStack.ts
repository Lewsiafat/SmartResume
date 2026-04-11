import type { TechCategory } from '../types'

export const techCategories: TechCategory[] = [
  {
    id: 'languages',
    icon: '💻',
    items: ['TypeScript', 'Python', 'JavaScript', 'Go', 'Shell'],
  },
  {
    id: 'frameworks',
    icon: '🎨',
    items: ['Vue.js 3', 'React', 'FastAPI', 'TailwindCSS', 'Vite'],
  },
  {
    id: 'ai_stack',
    icon: '🧠',
    items: ['LLM Integration', 'AI Agents', 'Prompt Engineering', 'RAG'],
  },
  {
    id: 'specializations',
    icon: '🎯',
    items: ['REST API Design', 'Cloud Deployment', 'CI/CD', 'Docker'],
  },
]
