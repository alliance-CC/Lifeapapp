export type UserRole = 'manager' | 'leader' | 'general'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department: string
  job_type: string
  avatar_url?: string
  created_at: string
}

export interface Character {
  id: string
  user_id: string
  name: string
  personality: string
  appearance: string
  level: number
  experience: number
  next_level_exp: number
  rank: string
  rank_color: string
  avatar_style: CharacterStyle
  created_at: string
}

export interface CharacterStyle {
  hair_color: string
  eye_color: string
  outfit_color: string
  accessory: string
  expression: string
}

export interface ChatMessage {
  id: string
  user_id: string
  character_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface DailyReport {
  id: string
  user_id: string
  date: string
  good_things: string
  bad_things: string
  bad_cause: string
  ai_advice?: string
  exp_earned: number
  created_at: string
}

export interface RankingEntry {
  user_id: string
  name: string
  department: string
  level: number
  experience: number
  monthly_exp: number
  rank: string
  rank_color: string
  avatar_url?: string
}

export interface ExperienceRule {
  id: string
  department: string
  job_type: string
  trigger: string
  data_source: string
  exp_per_unit: number
  daily_cap: number
  monthly_cap: number
  description: string
}

export interface LappyCoin {
  user_id: string
  balance: number
  total_earned: number
  history: LappyCoinTransaction[]
}

export interface LappyCoinTransaction {
  id: string
  user_id: string
  amount: number
  reason: string
  created_at: string
}

export interface ShiftEntry {
  date: string
  start_time: string
  end_time: string
  type: 'work' | 'off' | 'holiday'
  note?: string
}

export type Rank = 'S' | 'A' | 'B' | 'C' | 'D'

export interface Department {
  id: string
  name: string
  description: string
}

export interface JobType {
  id: string
  department_id: string
  name: string
  description: string
}
