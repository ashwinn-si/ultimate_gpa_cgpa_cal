'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { gradeConfigSchema } from '@/lib/utils/validators'
import { GRADE_SYSTEMS } from '@/lib/constants'

export async function getGradeConfigs() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('grade_configs')
    .select('*')
    .eq('user_id', user.id)
    .order('order', { ascending: true })

  if (error) throw new Error(error.message)

  // If no grades exist, initialize with default 10-point system
  if (!data || data.length === 0) {
    await initializeDefaultGrades(user.id)
    return await getGradeConfigs()
  }

  return data
}

export async function initializeDefaultGrades(userId: string) {
  const supabase = await createClient()

  const defaultGrades = GRADE_SYSTEMS['10-point'].map((grade) => ({
    user_id: userId,
    name: grade.name,
    points: grade.points,
    order: grade.order,
    is_default: true,
  }))

  const { error } = await supabase.from('grade_configs').insert(defaultGrades)

  if (error) throw new Error(error.message)
}

export async function createGradeConfig(formData: {
  name: string
  points: number
  description?: string
  minPercentage?: number
  maxPercentage?: number
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Validate input
  const validated = gradeConfigSchema.parse(formData)

  // Get max order
  const { data: maxOrderData } = await supabase
    .from('grade_configs')
    .select('order')
    .eq('user_id', user.id)
    .order('order', { ascending: false })
    .limit(1)

  const nextOrder = (maxOrderData?.[0]?.order ?? -1) + 1

  // Insert grade config
  const { data, error } = await supabase
    .from('grade_configs')
    .insert({
      user_id: user.id,
      name: validated.name,
      points: validated.points,
      description: validated.description,
      min_percentage: validated.minPercentage,
      max_percentage: validated.maxPercentage,
      order: nextOrder,
      is_default: false,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/settings/grades')

  return data
}

export async function updateGradeConfig(
  id: string,
  formData: Partial<{
    name: string
    points: number
    description?: string
    minPercentage?: number
    maxPercentage?: number
  }>
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('grade_configs')
    .update({
      name: formData.name,
      points: formData.points,
      description: formData.description,
      min_percentage: formData.minPercentage,
      max_percentage: formData.maxPercentage,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/settings/grades')

  return data
}

export async function deleteGradeConfig(id: string) {
  const supabase = await createClient()

  // Check if grade is in use
  const { data: subjectsUsingGrade } = await supabase
    .from('subjects')
    .select('id')
    .eq('grade', id)
    .limit(1)

  if (subjectsUsingGrade && subjectsUsingGrade.length > 0) {
    throw new Error('Cannot delete grade that is currently in use')
  }

  const { error } = await supabase.from('grade_configs').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/settings/grades')
}

export async function resetToDefaultGrades() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Delete all custom grades
  await supabase
    .from('grade_configs')
    .delete()
    .eq('user_id', user.id)
    .eq('is_default', false)

  revalidatePath('/settings/grades')
}
