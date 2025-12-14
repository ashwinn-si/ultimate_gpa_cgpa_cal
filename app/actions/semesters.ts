'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { semesterSchema } from '@/lib/utils/validators'
import { calculateSemesterGPA } from '@/lib/utils/calculations'

export async function getSemesters() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('semesters')
    .select('*, subjects(*)')
    .order('year', { ascending: false })
    .order('order', { ascending: true })

  if (error) throw new Error(error.message)

  return data
}

export async function getSemesterById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('semesters')
    .select('*, subjects(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)

  return data
}

export async function createSemester(formData: {
  name: string
  year: number
  term?: string
}) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Validate input
  const validated = semesterSchema.parse(formData)

  // Get max order
  const { data: maxOrderData } = await supabase
    .from('semesters')
    .select('order')
    .eq('user_id', user.id)
    .order('order', { ascending: false })
    .limit(1)

  const maxOrder = (maxOrderData as any)?.[0]?.order ?? -1
  const nextOrder = typeof maxOrder === 'number' ? maxOrder + 1 : 0

  // Insert semester
  const { data, error } = await supabase
    .from('semesters')
    .insert({
      user_id: user.id,
      name: validated.name,
      year: validated.year,
      term: validated.term,
      gpa: 0,
      total_credits: 0,
      order: nextOrder,
    } as any)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/semesters')

  return data
}

export async function updateSemester(
  id: string,
  formData: Partial<{
    name: string
    year: number
    term?: string
  }>
) {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('semesters')
    .update(formData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/semesters')
  revalidatePath(`/dashboard/semester/${id}`)

  return data
}

export async function deleteSemester(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('semesters').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/semesters')
  revalidatePath(`/dashboard/semester/${id}`)
}

export async function recalculateSemesterGPA(semesterId: string) {
  const supabase = await createClient()

  // Get all subjects for the semester
  const { data: subjects, error: subjectsError } = await supabase
    .from('subjects')
    .select('*')
    .eq('semester_id', semesterId)

  if (subjectsError) throw new Error(subjectsError.message)

  // Calculate GPA and total credits
  const gpa = calculateSemesterGPA(subjects as any)
  const totalCredits = (subjects as any).reduce((sum: number, s: any) => sum + s.credits, 0)

  // Update semester
  const { error: updateError } = await (supabase as any)
    .from('semesters')
    .update({
      gpa,
      total_credits: totalCredits,
    })
    .eq('id', semesterId)

  if (updateError) throw new Error(updateError.message)

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/semester/${semesterId}`)
}
