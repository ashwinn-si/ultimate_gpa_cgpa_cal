import { z } from 'zod'

export const semesterSchema = z.object({
  name: z.string()
    .min(1, 'Semester name is required')
    .max(100, 'Name must be less than 100 characters'),
  year: z.number()
    .int('Year must be an integer')
    .min(2000, 'Year must be 2000 or later')
    .max(2100, 'Year must be 2100 or earlier'),
  term: z.enum(['fall', 'spring', 'summer', 'winter']).optional(),
})

export const subjectSchema = z.object({
  name: z.string()
    .min(1, 'Subject name is required')
    .max(100, 'Name must be less than 100 characters'),
  grade: z.string()
    .min(1, 'Grade is required'),
  credits: z.number()
    .min(0.5, 'Credits must be at least 0.5')
    .max(10, 'Credits cannot exceed 10')
    .refine(
      (val) => val % 0.5 === 0,
      'Credits must be in increments of 0.5'
    ),
})

export const gradeConfigSchema = z.object({
  name: z.string()
    .min(1, 'Grade name is required')
    .max(10, 'Name must be less than 10 characters'),
  points: z.number()
    .min(0, 'Points must be non-negative')
    .max(10, 'Points cannot exceed 10'),
  description: z.string().max(100).optional(),
  minPercentage: z.number().min(0).max(100).optional(),
  maxPercentage: z.number().min(0).max(100).optional(),
})

export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  defaultGradingSystem: z.string(),
  decimalPrecision: z.number().int().min(1).max(4),
  includeFailedCourses: z.boolean(),
})

export type SemesterFormValues = z.infer<typeof semesterSchema>
export type SubjectFormValues = z.infer<typeof subjectSchema>
export type GradeConfigFormValues = z.infer<typeof gradeConfigSchema>
export type UserSettingsFormValues = z.infer<typeof userSettingsSchema>
