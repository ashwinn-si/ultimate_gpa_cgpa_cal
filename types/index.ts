export interface Semester {
  id: string
  userId: string
  name: string
  year: number
  term?: string
  gpa: number
  totalCredits: number
  order: number
  subjects?: Subject[]
  createdAt: Date
  updatedAt: Date
}

export interface Subject {
  id: string
  semesterId: string
  name: string
  grade: string
  gradePoints: number
  credits: number
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface GradeConfig {
  id: string
  userId: string
  name: string
  points: number
  description?: string
  minPercentage?: number
  maxPercentage?: number
  order: number
  isDefault: boolean
}

export interface UserSettings {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'auto'
  defaultGradingSystem: string
  decimalPrecision: number
  includeFailedCourses: boolean
  createdAt: Date
  updatedAt: Date
}

export type SemesterFormData = Pick<Semester, 'name' | 'year' | 'term'>
export type SubjectFormData = Pick<Subject, 'name' | 'grade' | 'credits'>
export type GradeConfigFormData = Pick<GradeConfig, 'name' | 'points' | 'description'>
