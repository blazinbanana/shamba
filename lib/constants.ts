import type { FieldStage, FieldStatus } from './types'
import { Sprout, Leaf, Wheat, CheckCircle, type LucideIcon } from 'lucide-react'
export const STAGE_CONFIG: Record<FieldStage, {
  label: string
  color: string
  bg: string
  border: string
  icon: LucideIcon 
  step: number
}> = {
  planted: {
    label: 'Planted',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    icon: Sprout, 
    step: 1,
  },
  growing: {
    label: 'Growing',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    icon: Leaf, 
    step: 2,
  },
  ready: {
    label: 'Ready',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    icon: Wheat, 
    step: 3,
  },
  harvested: {
    label: 'Harvested',
    color: 'text-purple-700',
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    icon: CheckCircle, 
    step: 4,
  },
}

export const STATUS_CONFIG: Record<FieldStatus, {
  label: string
  color: string
  bg: string
  dot: string
}> = {
  active: {
    label: 'Active',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
    dot: 'bg-emerald-500',
  },
  at_risk: {
    label: 'At Risk',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    dot: 'bg-amber-500',
  },
  completed: {
    label: 'Completed',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    dot: 'bg-slate-400',
  },
}

export const CROP_TYPES = [
  'Maize', 'Wheat', 'Rice', 'Sorghum', 'Millet',
  'Cassava', 'Sweet Potato', 'Beans', 'Cowpeas',
  'Groundnuts', 'Sunflower', 'Cotton', 'Coffee',
  'Tea', 'Sugar Cane', 'Tomatoes', 'Onions',
  'Kale', 'Cabbage', 'Spinach', 'Avocado', 'Other',
]

export const FIELD_STAGES: FieldStage[] = ['planted', 'growing', 'ready', 'harvested']