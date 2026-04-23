// Copyright 2026 Caleb Maina
export type UserRole = 'admin' | 'field_agent'
export type FieldStage = 'planted' | 'growing' | 'ready' | 'harvested'
export type FieldStatus = 'active' | 'at_risk' | 'completed'

export interface Profile {
  id: string
  full_name: string | null
  email: string
  role: UserRole
   role_selected: boolean  
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Field {
  id: string
  name: string
  crop_type: string
  planting_date: string
  current_stage: FieldStage
  location: string | null
  area_hectares: number | null
  assigned_agent_id: string | null
  created_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
  assigned_agent?: Profile | null
  status?: FieldStatus
}

export interface FieldUpdate {
  id: string
  field_id: string
  agent_id: string | null
  stage: FieldStage
  notes: string
  created_at: string
  agent?: Profile | null
  field?: Pick<Field, 'id' | 'name' | 'crop_type'> | null
}

export interface DashboardStats {
  totalFields: number
  activeFields: number
  atRiskFields: number
  completedFields: number
  stageBreakdown: Record<FieldStage, number>
}