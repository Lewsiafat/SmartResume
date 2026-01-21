export interface Skill {
  id: string
  icon: string
  items: string[]
}

export interface Project {
  id: string
  image: string
  tags: string[]
  github?: string
  demo?: string
}

export type ThemeMode = 'light' | 'dark'

export type Locale = 'zh-TW' | 'en'
