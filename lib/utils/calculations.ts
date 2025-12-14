import type { Subject, Semester } from '@/types'

/**
 * Calculate semester GPA using weighted average
 * Formula: GPA = Σ(Grade Points × Credits) / Σ(Credits)
 */
export function calculateSemesterGPA(subjects: any[]): number {
  if (subjects.length === 0) return 0

  let totalGradePoints = 0
  let totalCredits = 0

  for (const subject of subjects) {
    const gradePoints = subject.grade_points ?? subject.gradePoints ?? 0
    const credits = subject.credits ?? 0
    totalGradePoints += gradePoints * credits
    totalCredits += credits
  }

  if (totalCredits === 0) return 0

  const gpa = totalGradePoints / totalCredits
  return parseFloat(gpa.toFixed(2))
}

/**
 * Calculate overall CGPA across all semesters
 * Formula: CGPA = Σ(All Grade Points × Credits) / Σ(All Credits)
 */
export function calculateCGPA(semesters: Semester[]): number {
  if (semesters.length === 0) return 0

  let totalGradePoints = 0
  let totalCredits = 0

  for (const semester of semesters) {
    if (!semester.subjects || semester.subjects.length === 0) continue

    for (const subject of semester.subjects) {
      totalGradePoints += subject.gradePoints * subject.credits
      totalCredits += subject.credits
    }
  }

  if (totalCredits === 0) return 0

  const cgpa = totalGradePoints / totalCredits
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
    .sort((a, b) => b.gradePoints - a.gradePoints)
    .slice(0, limit)
}

/**
 * Get bottom performing subjects
 */
export function getBottomSubjects(subjects: Subject[], limit: number = 5): Subject[] {
  return [...subjects]
    .sort((a, b) => a.gradePoints - b.gradePoints)
    .slice(0, limit)
}
