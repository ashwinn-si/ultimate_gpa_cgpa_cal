import type { Subject, Semester } from '@/types'

/**
 * Calculate semester GPA
 * Formula: GPA = (Σ(Grade Points × Credits) / Σ(Credits × 10)) × 10
 * Where Credits × 10 is the maximum possible credit for each subject
 */
export function calculateSemesterGPA(subjects: any[]): number {
  if (subjects.length === 0) return 0

  let creditScored = 0
  let totalCredit = 0

  for (const subject of subjects) {
    const gradePoints = subject.grade_points ?? subject.gradePoints ?? 0
    const credits = subject.credits ?? 0
    
    // Credit scored = grade_points × credits
    creditScored += gradePoints * credits
    // Total credit = credits × 10 (max possible)
    totalCredit += credits * 10
  }

  if (totalCredit === 0) return 0

  // GPA = (Credit Scored / Total Credit) × 10
  const gpa = (creditScored / totalCredit) * 10
  return parseFloat(gpa.toFixed(2))
}

/**
 * Calculate overall CGPA across all semesters
 * Formula: CGPA = (Σ(Grade Points × Credits) / Σ(Credits × 10)) × 10
 * Where Credits × 10 is the maximum possible credit for each subject
 */
export function calculateCGPA(semesters: Semester[]): number {
  if (semesters.length === 0) return 0

  let creditScored = 0
  let totalCredit = 0

  for (const semester of semesters) {
    if (!semester.subjects || semester.subjects.length === 0) continue

    for (const subject of semester.subjects) {
      // Support both camelCase and snake_case
      const subj = subject as any
      const gradePoints = subj.grade_points ?? subj.gradePoints ?? 0
      const credits = subj.credits ?? 0
      
      // Credit scored = grade_points × credits
      creditScored += gradePoints * credits
      // Total credit = credits × 10 (max possible)
      totalCredit += credits * 10
    }
  }

  if (totalCredit === 0) return 0

  // CGPA = (Credit Scored / Total Credit) × 10
  const cgpa = (creditScored / totalCredit) * 10
  return parseFloat(cgpa.toFixed(2))
}

/**
 * Get performance level based on GPA
 */
export function getPerformanceLevel(gpa: number) {
  if (gpa >= 8.5) {
    return {
      level: 'Excellent',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Outstanding performance',
    }
  } else if (gpa >= 7.0) {
    return {
      level: 'Good',
      color: 'text-info',
      bgColor: 'bg-info/10',
      description: 'Strong performance',
    }
  } else if (gpa >= 6.0) {
    return {
      level: 'Average',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Satisfactory performance',
    }
  } else {
    return {
      level: 'Below Average',
      color: 'text-error',
      bgColor: 'bg-error/10',
      description: 'Needs improvement',
    }
  }
}

/**
 * Calculate total credits for a semester
 */
export function calculateTotalCredits(subjects: Subject[]): number {
  return subjects.reduce((sum, subject) => sum + subject.credits, 0)
}

/**
 * Calculate grade distribution
 */
export function calculateGradeDistribution(subjects: Subject[]) {
  const distribution: Record<string, number> = {}

  for (const subject of subjects) {
    distribution[subject.grade] = (distribution[subject.grade] || 0) + 1
  }

  return Object.entries(distribution).map(([grade, count]) => ({
    grade,
    count,
    percentage: (count / subjects.length) * 100,
  }))
}

/**
 * Get top performing subjects
 */
export function getTopSubjects(subjects: Subject[], limit: number = 5): Subject[] {
  return [...subjects]
    .sort((a, b) => {
      const aSubj = a as any
      const bSubj = b as any
      const aPoints = aSubj.grade_points ?? aSubj.gradePoints ?? 0
      const bPoints = bSubj.grade_points ?? bSubj.gradePoints ?? 0
      return bPoints - aPoints
    })
    .slice(0, limit)
}

/**
 * Get bottom performing subjects
 */
export function getBottomSubjects(subjects: Subject[], limit: number = 5): Subject[] {
  return [...subjects]
    .sort((a, b) => {
      const aSubj = a as any
      const bSubj = b as any
      const aPoints = aSubj.grade_points ?? aSubj.gradePoints ?? 0
      const bPoints = bSubj.grade_points ?? bSubj.gradePoints ?? 0
      return aPoints - bPoints
    })
    .slice(0, limit)
}
