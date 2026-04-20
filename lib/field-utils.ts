import type { Field, FieldStatus, FieldStage } from './types'

/**
 * Computes a field's status from its current stage and temporal indicators.
 *
 * Rules:
 *  - completed  → stage is 'harvested'
 *  - at_risk    → (planted > 21 days) | (growing, no update > 30 days) | (ready, no harvest > 10 days)
 *  - active     → everything else
 */
export function computeFieldStatus(
  field: Pick<Field, 'current_stage' | 'planting_date' | 'updated_at'>
): FieldStatus {
  const now = Date.now()
  const MS = 1000 * 60 * 60 * 24
  const daysSincePlanting = Math.floor((now - new Date(field.planting_date).getTime()) / MS)
  const daysSinceUpdate   = Math.floor((now - new Date(field.updated_at).getTime()) / MS)

  if (field.current_stage === 'harvested')                               return 'completed'
  if (field.current_stage === 'planted' && daysSincePlanting > 21)       return 'at_risk'
  if (field.current_stage === 'growing' && daysSinceUpdate   > 30)       return 'at_risk'
  if (field.current_stage === 'ready'   && daysSinceUpdate   > 10)       return 'at_risk'
  return 'active'
}

export function getStageProgress(stage: FieldStage): number {
  return { planted: 15, growing: 45, ready: 75, harvested: 100 }[stage]
}

export function getDaysSincePlanting(plantingDate: string): number {
  return Math.floor((Date.now() - new Date(plantingDate).getTime()) / (1000 * 60 * 60 * 24))
}

export function withStatus<T extends Pick<Field, 'current_stage' | 'planting_date' | 'updated_at'>>(
  field: T
): T & { status: FieldStatus } {
  return { ...field, status: computeFieldStatus(field) }
}