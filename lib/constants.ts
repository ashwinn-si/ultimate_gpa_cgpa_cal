export const APP_NAME = 'CGPA Calculator'
export const APP_DESCRIPTION = 'Track and calculate your academic performance'

export const DEFAULT_GRADE_SYSTEM = '10-point'

export const GRADE_SYSTEMS = {
  '10-point': [
    { name: 'O', points: 10, order: 0 },
    { name: 'A+', points: 9, order: 1 },
    { name: 'A', points: 8, order: 2 },
    { name: 'B+', points: 8, order: 3 },
    { name: 'B', points: 7, order: 4 },
    { name: 'C+', points: 6, order: 5 },
    { name: 'C', points: 5, order: 6 },
    { name: 'U', points: 0, order: 7 },
  ],
  '4-point': [
    { name: 'A', points: 4.0, order: 0 },
    { name: 'A-', points: 3.7, order: 1 },
    { name: 'B+', points: 3.3, order: 2 },
    { name: 'B', points: 3.0, order: 3 },
    { name: 'B-', points: 2.7, order: 4 },
    { name: 'C+', points: 2.3, order: 5 },
    { name: 'C', points: 2.0, order: 6 },
    { name: 'D', points: 1.0, order: 7 },
    { name: 'F', points: 0, order: 8 },
  ],
} as const

export const TERMS = ['fall', 'spring', 'summer', 'winter'] as const

export const CREDIT_OPTIONS = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10,
]

export const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
] as const

export const DECIMAL_PRECISION_OPTIONS = [1, 2, 3, 4]

export const DEFAULT_SETTINGS = {
  theme: 'auto' as const,
  defaultGradingSystem: DEFAULT_GRADE_SYSTEM,
  decimalPrecision: 2,
  includeFailedCourses: true,
}
