'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { gradeConfigSchema } from '@/lib/utils/validators'
import { GRADE_SYSTEMS } from '@/lib/constants'
import { recalculateSemesterGPA } from './semesters'

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
    .order('points', { ascending: false })

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

  const { error } = await supabase.from('grade_configs').insert(defaultGrades as any)

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

  // Check for duplicate grade points
  const { data: existingGrades } = await supabase
    .from('grade_configs')
    .select('id')
    .eq('user_id', user.id)
    .eq('points', validated.points)
    .limit(1)

  if (existingGrades && existingGrades.length > 0) {
    throw new Error(`A grade with ${validated.points} points already exists`)
  }

  // Get max order
  const { data: maxOrderData } = await supabase
    .from('grade_configs')
    .select('order')
    .eq('user_id', user.id)
    .order('order', { ascending: false })
    .limit(1)

  const nextOrder = (maxOrderData as any)?.[0]?.order ?? 0
  const newOrder = typeof nextOrder === 'number' ? nextOrder + 1 : 0

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
      order: newOrder,
      is_default: false,
    } as any)
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Check for duplicate grade points (excluding current grade)
  if (formData.points !== undefined) {
    const { data: existingGrades } = await supabase
      .from('grade_configs')
      .select('id')
      .eq('user_id', user.id)
      .eq('points', formData.points)
      .neq('id', id)
      .limit(1)

    if (existingGrades && existingGrades.length > 0) {
      throw new Error(`A grade with ${formData.points} points already exists`)
    }
  }

  const updateData: any = {
    name: formData.name,
    points: formData.points,
    description: formData.description,
    min_percentage: formData.minPercentage,
    max_percentage: formData.maxPercentage,
  }

  const { data, error } = await (supabase as any)
    .from('grade_configs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/settings/grades')

  return data
}

export async function deleteGradeConfig(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Get the grade being deleted to know its points
  const { data: gradeToDelete } = await supabase
    .from('grade_configs')
    .select('points')
    .eq('id', id)
    .single()

  if (!gradeToDelete) {
    throw new Error('Grade not found')
  }

  // Find all subjects using this grade
  const { data: subjectsUsingGrade } = await supabase
    .from('subjects')
    .select('id, semester_id')
    .eq('grade', id)

  const typedSubjects = (subjectsUsingGrade as any) || []

  if (typedSubjects && typedSubjects.length > 0) {
    // Find the second-highest grade by points (excluding the one being deleted)
    const { data: allGrades } = await supabase
      .from('grade_configs')
      .select('id, points, name')
      .eq('user_id', user.id)
      .neq('id', id)
      .order('points', { ascending: false })

    if (!allGrades || allGrades.length === 0) {
      throw new Error('Cannot delete the only grade in your system')
    }

    // Get the second-highest grade (first in the sorted array after excluding deleted one)
    const secondHighestGrade: any = allGrades[0]

    // Update all subjects to use the second-highest grade
    const { error: updateError } = await (supabase as any)
      .from('subjects')
      .update({
        grade: secondHighestGrade.id,
        grade_points: secondHighestGrade.points,
      })
      .eq('grade', id)

    if (updateError) {
      throw new Error(`Failed to reassign subjects: ${updateError.message}`)
    }

    // Recalculate GPA for affected semesters
    const affectedSemesterIds = [
      ...new Set(typedSubjects.map((s: any) => s.semester_id)),
    ]

    for (const semesterId of affectedSemesterIds) {
      await recalculateSemesterGPA(semesterId as string)
    }
  }

  // Now delete the grade
  const { error } = await supabase.from('grade_configs').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/settings/grades')
  revalidatePath('/dashboard')
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
