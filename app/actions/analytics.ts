'use server'

import { createClient } from '@/lib/supabase/server'
import { calculateSemesterGPA } from '@/lib/utils/calculations'

export interface AnalyticsData {
  gpaByYear: { year: number; gpa: number }[]
  gpaBySemester: { semesterName: string; gpa: number; year: number }[]
  cgpaBySemester: { semesterName: string; cgpa: number; year: number }[]
  gradeDistribution: { grade: string; count: number; percentage: number }[]
  performanceMetrics: {
    cgpa: number
    totalCredits: number
    totalSubjects: number
    averageCreditsPerSemester: number
    bestSemester: { name: string; gpa: number } | null
    worstSemester: { name: string; gpa: number } | null
  }
  creditsByYear: { year: number; credits: number }[]
  subjectsByGrade: { grade: string; subjects: string[] }[]
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Fetch all semesters with subjects
  const { data: semesters, error } = await supabase
    .from('semesters')
    .select('*, subjects(*)')
    .order('year', { ascending: true })
    .order('order', { ascending: true })

  if (error) throw new Error(error.message)

  // Type assertion for the query result
  type SemesterWithSubjects = {
    id: string
    name: string
    year: number
    subjects: Array<{
      id: string
      name: string
      grade: string
      grade_points: number
      credits: number
    }> | null
  }

  const typedSemesters = (semesters as SemesterWithSubjects[]) || []

  if (!typedSemesters || typedSemesters.length === 0) {
    return {
      gpaByYear: [],
      gpaBySemester: [],
      cgpaBySemester: [],
      gradeDistribution: [],
      performanceMetrics: {
        cgpa: 0,
        totalCredits: 0,
        totalSubjects: 0,
        averageCreditsPerSemester: 0,
        bestSemester: null,
        worstSemester: null,
      },
      creditsByYear: [],
      subjectsByGrade: [],
    }
  }

  // Calculate GPA by semester
  const gpaBySemester = typedSemesters.map((semester) => ({
    semesterName: semester.name,
    gpa: calculateSemesterGPA(semester.subjects || []),
    year: semester.year,
  }))

  // Calculate cumulative CGPA by semester
  const cgpaBySemester: { semesterName: string; cgpa: number; year: number }[] = []
  let cumulativeCreditScored = 0
  let cumulativeCredits = 0

  for (let i = 0; i < typedSemesters.length; i++) {
    const semester = typedSemesters[i]
    
    // Add current semester's data to cumulative totals
    for (const subject of semester.subjects || []) {
      const gradePoints = subject.grade_points ?? 0
      const credits = subject.credits ?? 0
      cumulativeCredits += credits * 10
      cumulativeCreditScored += gradePoints * credits
    }

    // Calculate CGPA up to this semester
    const cgpaUpToNow = cumulativeCredits > 0 
      ? parseFloat(((cumulativeCreditScored / cumulativeCredits) * 10).toFixed(2)) 
      : 0

    cgpaBySemester.push({
      semesterName: semester.name,
      cgpa: cgpaUpToNow,
      year: semester.year,
    })
  }

  // Calculate GPA by year (average GPA for each year)
  const gpaByYearMap = new Map<number, { total: number; count: number }>()
  for (const item of gpaBySemester) {
    const existing = gpaByYearMap.get(item.year) || { total: 0, count: 0 }
    gpaByYearMap.set(item.year, {
      total: existing.total + item.gpa,
      count: existing.count + 1,
    })
  }
  const gpaByYear = Array.from(gpaByYearMap.entries()).map(([year, data]) => ({
    year,
    gpa: parseFloat((data.total / data.count).toFixed(2)),
  }))

  // Calculate grade distribution
  const gradeCountMap = new Map<string, number>()
  const subjectsByGradeMap = new Map<string, Set<string>>()
  let totalSubjects = 0

  for (const semester of typedSemesters) {
    for (const subject of semester.subjects || []) {
      totalSubjects++
      const grade = subject.grade || 'Unknown'
      gradeCountMap.set(grade, (gradeCountMap.get(grade) || 0) + 1)

      if (!subjectsByGradeMap.has(grade)) {
        subjectsByGradeMap.set(grade, new Set())
      }
      subjectsByGradeMap.get(grade)?.add(subject.name)
    }
  }

  const gradeDistribution = Array.from(gradeCountMap.entries())
    .map(([grade, count]) => ({
      grade,
      count,
      percentage: parseFloat(((count / totalSubjects) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count)

  const subjectsByGrade = Array.from(subjectsByGradeMap.entries()).map(([grade, subjects]) => ({
    grade,
    subjects: Array.from(subjects),
  }))

  // Calculate credits by year
  const creditsByYearMap = new Map<number, number>()
  for (const semester of typedSemesters) {
    const year = semester.year
    const credits = (semester.subjects || []).reduce((sum, s) => sum + (s.credits || 0), 0)
    creditsByYearMap.set(year, (creditsByYearMap.get(year) || 0) + credits)
  }
  const creditsByYear = Array.from(creditsByYearMap.entries()).map(([year, credits]) => ({
    year,
    credits,
  }))

  // Calculate performance metrics
  let totalCredits = 0
  let totalCreditScored = 0

  for (const semester of typedSemesters) {
    for (const subject of semester.subjects || []) {
      const gradePoints = subject.grade_points ?? 0
      const credits = subject.credits ?? 0
      totalCredits += credits * 10
      totalCreditScored += gradePoints * credits
    }
  }

  const cgpa = totalCredits > 0 ? parseFloat(((totalCreditScored / totalCredits) * 10).toFixed(2)) : 0
  const averageCreditsPerSemester = typedSemesters.length > 0 
    ? parseFloat((creditsByYear.reduce((sum, c) => sum + c.credits, 0) / typedSemesters.length).toFixed(2))
    : 0

  // Find best and worst semesters
  const semestersWithGPA = gpaBySemester.filter((s) => s.gpa > 0)
  const bestSemester = semestersWithGPA.length > 0
    ? semestersWithGPA.reduce((best, current) => (current.gpa > best.gpa ? current : best))
    : null
  const worstSemester = semestersWithGPA.length > 0
    ? semestersWithGPA.reduce((worst, current) => (current.gpa < worst.gpa ? current : worst))
    : null

  return {
    gpaByYear,
    gpaBySemester,
    cgpaBySemester,
    gradeDistribution,
    performanceMetrics: {
      cgpa,
      totalCredits: creditsByYear.reduce((sum, c) => sum + c.credits, 0),
      totalSubjects,
      averageCreditsPerSemester,
      bestSemester: bestSemester ? { name: bestSemester.semesterName, gpa: bestSemester.gpa } : null,
      worstSemester: worstSemester ? { name: worstSemester.semesterName, gpa: worstSemester.gpa } : null,
    },
    creditsByYear,
    subjectsByGrade,
  }
}
