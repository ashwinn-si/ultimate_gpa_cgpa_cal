'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { subjectSchema } from '@/lib/utils/validators'
import { recalculateSemesterGPA } from './semesters'

export async function getSubjectsBySemester(semesterId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('semester_id', semesterId)
    .order('order', { ascending: true })

  if (error) throw new Error(error.message)

  return data
}

export async function createSubject(formData: {
  semesterId: string
  name: string
  grade: string
  gradePoints: number
  credits: number
}) {
  const supabase = await createClient()

  // Validate input
  const validated = subjectSchema.parse({
    name: formData.name,
    grade: formData.grade,
    credits: formData.credits,
  })

  // Get max order
  const { data: maxOrderData } = await supabase
    .from('subjects')
    .select('order')
    .eq('semester_id', formData.semesterId)
    .order('order', { ascending: false })
    .limit(1)

  const maxOrder = (maxOrderData as any)?.[0]?.order ?? -1
  const nextOrder = typeof maxOrder === 'number' ? maxOrder + 1 : 0

  // Insert subject
  const { data, error } = await supabase
    .from('subjects')
    .insert({
      semester_id: formData.semesterId,
      name: validated.name,
      grade: validated.grade,
      grade_points: formData.gradePoints,
      credits: validated.credits,
      order: nextOrder,
    } as any)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Recalculate semester GPA
  await recalculateSemesterGPA(formData.semesterId)

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/semester/${formData.semesterId}`)

  return data
}

export async function updateSubject(
  id: string,
  semesterId: string,
  formData: Partial<{
    name: string
    grade: string
    gradePoints: number
    credits: number
  }>
) {
  const supabase = await createClient()

  // Map camelCase to snake_case for database
  const updateData: any = {}
  if (formData.name !== undefined) updateData.name = formData.name
  if (formData.grade !== undefined) updateData.grade = formData.grade
  if (formData.gradePoints !== undefined) updateData.grade_points = formData.gradePoints
  if (formData.credits !== undefined) updateData.credits = formData.credits

  const { data, error } = await (supabase as any)
    .from('subjects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Recalculate semester GPA
  await recalculateSemesterGPA(semesterId)

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/semester/${semesterId}`)

  return data
}

export async function deleteSubject(id: string, semesterId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('subjects').delete().eq('id', id)

  if (error) throw new Error(error.message)

  // Recalculate semester GPA
  await recalculateSemesterGPA(semesterId)

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/semester/${semesterId}`)
}

export async function bulkCreateSubjects(
  semesterId: string,
  subjects: Array<{
    name: string
    grade: string
    gradePoints: number
    credits: number
  }>
) {
  const supabase = await createClient()

  // Get max order
  const { data: maxOrderData } = await supabase
    .from('subjects')
    .select('order')
    .eq('semester_id', semesterId)
    .order('order', { ascending: false })
    .limit(1)

  const maxOrder = (maxOrderData as any)?.[0]?.order ?? -1
  let nextOrder = typeof maxOrder === 'number' ? maxOrder + 1 : 0

  // Prepare data with orders
  const subjectsData = subjects.map((subject) => ({
    semester_id: semesterId,
    name: subject.name,
    grade: subject.grade,
    grade_points: subject.gradePoints,
    credits: subject.credits,
    order: nextOrder++,
  }))

  // Insert subjects
  const { data, error } = await supabase
    .from('subjects')
    .insert(subjectsData as any)
    .select()

  if (error) throw new Error(error.message)

  // Recalculate semester GPA
  await recalculateSemesterGPA(semesterId)

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/semester/${semesterId}`)

  return data
}
