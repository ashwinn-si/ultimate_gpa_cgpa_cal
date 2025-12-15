# GitHub Copilot Instructions - CGPA/GPA Calculator Web App

## Project Overview

This is a **Next.js 14+ web application** built with **TypeScript**, **TailwindCSS**, and **Supabase** for calculating and tracking student GPA (Grade Point Average) and CGPA (Cumulative Grade Point Average). The app provides semester management, subject tracking, grade configuration, analytics dashboards, and data export capabilities.

---

## Tech Stack

### Frontend
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Shadcn/ui** for UI components
- **Framer Motion** for animations
- **Recharts** for data visualization

### Backend
- **Supabase** (PostgreSQL + Auth + Realtime + Storage)
- **Next.js Server Actions** for API logic
- **Row Level Security (RLS)** for data protection

### Deployment
- **Vercel** for hosting
- **Supabase Cloud** for backend services

---

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx                    # Home dashboard
│   │   ├── semester/[id]/page.tsx      # Semester detail
│   │   ├── settings/page.tsx           # Settings
│   │   └── settings/grades/page.tsx    # Grade configuration
│   ├── actions/
│   │   ├── semesters.ts                # Semester CRUD actions
│   │   ├── subjects.ts                 # Subject CRUD actions
│   │   ├── grades.ts                   # Grade config actions
│   │   ├── analytics.ts                # Analytics data
│   │   └── settings.ts                 # User settings
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts # Auth API routes
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # Shadcn/ui base components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── semester/
│   │   ├── SemesterCard.tsx
│   │   ├── SemesterGrid.tsx
│   │   ├── SemesterForm.tsx
│   │   ├── SemesterDetail.tsx
│   │   ├── EditSemesterButton.tsx
│   │   └── DeleteSemesterButton.tsx
│   ├── subject/
│   │   ├── SubjectList.tsx
│   │   ├── SubjectRow.tsx
│   │   ├── SubjectForm.tsx
│   │   ├── AddSubjectButton.tsx
│   │   ├── EditSubjectButton.tsx
│   │   ├── DeleteSubjectButton.tsx
│   │   └── BulkSubjectImport.tsx
│   ├── grades/
│   │   ├── AddGradeButton.tsx
│   │   ├── EditGradeButton.tsx
│   │   └── DeleteGradeButton.tsx
│   ├── dashboard/
│   │   ├── CGPACard.tsx
│   │   ├── StatsCard.tsx
│   │   ├── GPATrendChart.tsx
│   │   └── GradeDistributionChart.tsx
│   ├── shared/
│   │   ├── ThemeToggle.tsx
│   │   ├── SearchBar.tsx
│   │   └── EmptyState.tsx
│   └── providers/
│       └── ThemeProvider.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Supabase client
│   │   ├── server.ts                   # Server-side client
│   │   └── middleware.ts               # Auth middleware
│   ├── utils/
│   │   ├── calculations.ts             # GPA/CGPA logic
│   │   ├── validators.ts               # Form validators
│   │   └── formatters.ts               # Data formatters
│   └── constants.ts                    # App constants
├── types/
│   ├── database.ts                     # Supabase types
│   ├── semester.ts
│   ├── subject.ts
│   └── grade.ts
├── hooks/
│   ├── useSemesters.ts
│   ├── useSubjects.ts
│   ├── useGrades.ts
│   └── useAnalytics.ts
└── public/
    ├── images/
    └── fonts/
```

---

## Coding Standards

### General Guidelines

1. **Always use TypeScript** - No `any` types unless absolutely necessary
2. **Use functional components** - Prefer function components over class components
3. **Server Components by default** - Use `'use client'` only when necessary (interactivity, hooks, browser APIs)
4. **Async Server Actions** - Use Server Actions for mutations instead of API routes
5. **Type everything** - Interfaces for props, return types for functions

### Naming Conventions

```typescript
// Components: PascalCase
export function SemesterCard({ semester }: SemesterCardProps) {}

// Functions: camelCase
function calculateSemesterGPA(subjects: Subject[]): number {}

// Constants: UPPER_SNAKE_CASE
const MAX_CREDITS_PER_SUBJECT = 10;

// Types/Interfaces: PascalCase
interface Semester {
  id: string;
  name: string;
}

// Files: kebab-case for utilities, PascalCase for components
// ✅ lib/utils/calculation-helpers.ts
// ✅ components/SemesterCard.tsx
```

### Code Style

```typescript
// Always use explicit return types for functions
function calculateGPA(subjects: Subject[]): number {
  // implementation
}

// Use optional chaining and nullish coalescing
const gpa = semester?.gpa ?? 0;

// Prefer const over let
const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

// Use template literals for strings
const message = `Semester ${semester.name} has GPA ${gpa.toFixed(2)}`;

// Destructure props
function SemesterCard({ semester, onEdit, onDelete }: SemesterCardProps) {}

// Use early returns for guard clauses
function calculateGPA(subjects: Subject[]): number {
  if (subjects.length === 0) return 0;
  if (!subjects.every(s => s.credits > 0)) return 0;
  
  // main logic here
}
```

---

## Component Patterns

### Server Components (Default)

```typescript
// app/page.tsx
import { getSemesters } from '@/app/actions/semesters';
import { SemesterGrid } from '@/components/semester/SemesterGrid';

export default async function DashboardPage() {
  const semesters = await getSemesters();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <SemesterGrid semesters={semesters} />
    </div>
  );
}
```

### Client Components (Interactive)

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SemesterFormProps {
  onSubmit: (data: SemesterFormData) => Promise<void>;
}

export function SemesterForm({ onSubmit }: SemesterFormProps) {
  const [name, setName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, year });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Composite Pattern

```typescript
// Break large components into smaller sub-components
function SemesterCard({ semester }: SemesterCardProps) {
  return (
    <Card>
      <SemesterCardHeader semester={semester} />
      <SemesterCardBody semester={semester} />
      <SemesterCardFooter semester={semester} />
    </Card>
  );
}
```

### Passing Icons Between Server and Client Components

**CRITICAL**: You cannot pass React component instances (like Lucide icons) from Server Components to Client Components. Only serializable data can be passed.

```typescript
// ❌ WRONG - This will cause an error
// app/page.tsx (Server Component)
import { BookOpen } from 'lucide-react'

export default async function Page() {
  return <StatsCard icon={BookOpen} />  // ERROR!
}

// ✅ CORRECT - Pass icon name as string
// app/page.tsx (Server Component)
export default async function Page() {
  return <StatsCard iconName="BookOpen" />
}

// components/StatsCard.tsx (Client Component)
'use client'
import * as Icons from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  iconName?: string
  icon?: LucideIcon  // For use within Client Components
}

export function StatsCard({ iconName, icon }: StatsCardProps) {
  // Dynamically get icon from string name
  const DynamicIcon = iconName 
    ? (Icons[iconName as keyof typeof Icons] as LucideIcon) 
    : icon

  return (
    <Card>
      {DynamicIcon && <DynamicIcon className="h-4 w-4" />}
    </Card>
  )
}
```

**Pattern Summary:**
- Server Components → Client Components: Use `iconName="IconName"` (string)
- Client Components → Client Components: Can use `icon={IconComponent}` (component)
- Client Components handle icon rendering with dynamic imports

---

## Server Actions Pattern

### CRUD Operations

```typescript
// app/actions/semesters.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createSemester(data: {
  name: string;
  year: number;
  term?: string;
}) {
  const supabase = createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }
  
  // Insert semester
  const { data: semester, error } = await supabase
    .from('semesters')
    .insert({
      user_id: user.id,
      name: data.name,
      year: data.year,
      term: data.term,
      gpa: 0,
      total_credits: 0,
      order: 0,
    })
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  // Revalidate cache
  revalidatePath('/');
  
  return semester;
}

export async function getSemesters() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('semesters')
    .select('*')
    .order('year', { ascending: false })
    .order('order', { ascending: true });
  
  if (error) throw new Error(error.message);
  
  return data;
}

export async function updateSemester(id: string, data: Partial<Semester>) {
  const supabase = createClient();
  
  const { data: semester, error } = await supabase
    .from('semesters')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  revalidatePath('/');
  revalidatePath(`/semester/${id}`);
  
  return semester;
}

export async function deleteSemester(id: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('semesters')
    .delete()
    .eq('id', id);
  
  if (error) throw new Error(error.message);
  
  revalidatePath('/');
}
```

### Using Server Actions in Components

```typescript
'use client';

import { createSemester } from '@/app/actions/semesters';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function SemesterForm() {
  const [isPending, startTransition] = useTransition();
  
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createSemester({
          name: formData.get('name') as string,
          year: parseInt(formData.get('year') as string),
        });
        toast.success('Semester created successfully!');
      } catch (error) {
        toast.error('Failed to create semester');
      }
    });
  };
  
  return (
    <form action={handleSubmit}>
      {/* form fields */}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Semester'}
      </Button>
    </form>
  );
}
```

---

## Styling Guidelines

### TailwindCSS Best Practices

```typescript
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">

// Use cn() helper for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  'px-4 py-2 rounded-md',
  isActive && 'bg-primary text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>

// Responsive design with Tailwind breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Dark mode with dark: prefix
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
```

### Color System

```typescript
// Use CSS variables defined in globals.css
// These are theme-aware and change with light/dark mode

// Primary colors
className="bg-primary text-primary-foreground"

// Semantic colors
className="text-success"  // Green for excellent GPA
className="text-warning"  // Yellow for average GPA
className="text-error"    // Red for poor GPA
className="text-info"     // Blue for good GPA

// Neutral colors
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="bg-muted text-muted-foreground"
```

### Component Styling

```typescript
// Use Shadcn/ui components as base
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Extend with Tailwind classes
<Button className="w-full" variant="default" size="lg">
  Add Semester
</Button>

// Gradients for visual appeal
<div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-8 rounded-xl">
```

---

## GPA Calculation Logic

### Core Calculation Functions

```typescript
// lib/utils/calculations.ts

/**
 * Calculate semester GPA using weighted average
 * Formula: GPA = (Σ(Grade Points × Credits) / Σ(Credits × 10)) × 10
 * Note: Total credit for a subject = credits × 10
 */
export function calculateSemesterGPA(subjects: Subject[]): number {
  if (subjects.length === 0) return 0;
  
  let totalGradePoints = 0;
  let totalCredits = 0;
  
  for (const subject of subjects) {
    totalGradePoints += subject.gradePoints * subject.credits;
    totalCredits += subject.credits * 10;
  }
  
  if (totalCredits === 0) return 0;
  
  const gpa = (totalGradePoints / totalCredits) * 10;
  return parseFloat(gpa.toFixed(2)); // Round to 2 decimal places
}

/**
 * Calculate overall CGPA across all semesters
 * Formula: CGPA = (Σ(All Grade Points × Credits) / Σ(All Credits × 10)) × 10
 * Note: Total credit for a subject = credits × 10
 */
export function calculateCGPA(semesters: Semester[]): number {
  if (semesters.length === 0) return 0;
  
  let totalGradePoints = 0;
  let totalCredits = 0;
  
  for (const semester of semesters) {
    if (!semester.subjects) continue;
    
    for (const subject of semester.subjects) {
      totalGradePoints += subject.gradePoints * subject.credits;
      totalCredits += subject.credits * 10;
    }
  }
  
  if (totalCredits === 0) return 0;
  
  const cgpa = (totalGradePoints / totalCredits) * 10;
  return parseFloat(cgpa.toFixed(2));
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
    };
  } else if (gpa >= 7.0) {
    return {
      level: 'Good',
      color: 'text-info',
      bgColor: 'bg-info/10',
      description: 'Strong performance',
    };
  } else if (gpa >= 6.0) {
    return {
      level: 'Average',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Satisfactory performance',
    };
  } else {
    return {
      level: 'Below Average',
      color: 'text-error',
      bgColor: 'bg-error/10',
      description: 'Needs improvement',
    };
  }
}

/**
 * Calculate total credits for a semester
 */
export function calculateTotalCredits(subjects: Subject[]): number {
  return subjects.reduce((sum, subject) => sum + subject.credits, 0);
}
```

### Using Calculations

```typescript
// In components
import { calculateSemesterGPA, getPerformanceLevel } from '@/lib/utils/calculations';

const gpa = calculateSemesterGPA(semester.subjects);
const performance = getPerformanceLevel(gpa);

<div className={performance.bgColor}>
  <span className={performance.color}>{gpa.toFixed(2)}</span>
  <span>{performance.level}</span>
</div>
```

---

## Database Types

### Generate Supabase Types

```bash
# Generate TypeScript types from Supabase schema
npx supabase gen types typescript --project-id <project-id> > types/database.ts
```

### Type Definitions

```typescript
// types/database.ts (auto-generated)
export type Database = {
  public: {
    Tables: {
      semesters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          year: number;
          term: string | null;
          gpa: number;
          total_credits: number;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          year: number;
          term?: string | null;
          gpa?: number;
          total_credits?: number;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          year?: number;
          term?: string | null;
          gpa?: number;
          total_credits?: number;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      // ... other tables
    };
  };
};

// types/semester.ts (custom types)
export interface Semester {
  id: string;
  userId: string;
  name: string;
  year: number;
  term?: string;
  gpa: number;
  totalCredits: number;
  order: number;
  subjects?: Subject[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  semesterId: string;
  name: string;
  grade: string;
  gradePoints: number;
  credits: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GradeConfig {
  id: string;
  userId: string;
  name: string;
  points: number;
  description?: string;
  order: number;
  isDefault: boolean;
}
```

---

## Form Validation

### Zod Schemas

```typescript
// lib/utils/validators.ts
import { z } from 'zod';

export const semesterSchema = z.object({
  name: z.string()
    .min(1, 'Semester name is required')
    .max(100, 'Name must be less than 100 characters'),
  year: z.number()
    .int('Year must be an integer')
    .min(2000, 'Year must be 2000 or later')
    .max(2100, 'Year must be 2100 or earlier'),
  term: z.enum(['fall', 'spring', 'summer', 'winter']).optional(),
});

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
});

export const gradeConfigSchema = z.object({
  name: z.string()
    .min(1, 'Grade name is required')
    .max(10, 'Name must be less than 10 characters'),
  points: z.number()
    .min(0, 'Points must be non-negative')
    .max(10, 'Points cannot exceed 10'),
  description: z.string().max(100).optional(),
});
```

### React Hook Form Integration

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subjectSchema } from '@/lib/utils/validators';

export function SubjectForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectSchema),
  });
  
  const onSubmit = async (data: z.infer<typeof subjectSchema>) => {
    // Submit logic
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('credits', { valueAsNumber: true })} />
      {errors.credits && <span>{errors.credits.message}</span>}
    </form>
  );
}
```

---

## Error Handling

### Try-Catch Pattern

```typescript
// In Server Actions
export async function createSemester(data: SemesterFormData) {
  try {
    const supabase = createClient();
    
    // Validate input
    const validated = semesterSchema.parse(data);
    
    // Database operation
    const { data: semester, error } = await supabase
      .from('semesters')
      .insert(validated)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    revalidatePath('/');
    return { success: true, data: semester };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors };
    }
    
    return { success: false, error: error.message };
  }
}
```

### Error Boundaries

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

---

## Testing Guidelines

### Unit Tests (Jest + React Testing Library)

```typescript
// __tests__/utils/calculations.test.ts
import { calculateSemesterGPA, calculateCGPA } from '@/lib/utils/calculations';

describe('GPA Calculations', () => {
  describe('calculateSemesterGPA', () => {
    it('should calculate GPA correctly', () => {
      const subjects = [
        { name: 'Math', grade: 'A', gradePoints: 10, credits: 4 },
        { name: 'Physics', grade: 'B', gradePoints: 7, credits: 3 },
      ];
      
      const gpa = calculateSemesterGPA(subjects);
      expect(gpa).toBe(8.71);
    });
    
    it('should return 0 for empty subjects', () => {
      expect(calculateSemesterGPA([])).toBe(0);
    });
    
    it('should handle zero credits', () => {
      const subjects = [{ name: 'Test', gradePoints: 10, credits: 0 }];
      expect(calculateSemesterGPA(subjects)).toBe(0);
    });
  });
});
```

### Component Tests

```typescript
// __tests__/components/SemesterCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SemesterCard } from '@/components/semester/SemesterCard';

describe('SemesterCard', () => {
  const mockSemester = {
    id: '1',
    name: 'Fall 2024',
    year: 2024,
    gpa: 8.75,
    totalCredits: 20,
    subjects: [],
  };
  
  it('renders semester information', () => {
    render(<SemesterCard semester={mockSemester} />);
    
    expect(screen.getByText('Fall 2024')).toBeInTheDocument();
    expect(screen.getByText('8.75')).toBeInTheDocument();
    expect(screen.getByText('20 Credits')).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<SemesterCard semester={mockSemester} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockSemester.id);
  });
});
```

---

## Performance Optimization

### React Best Practices

```typescript
// Use React.memo for expensive components
export const SemesterCard = React.memo(({ semester }: SemesterCardProps) => {
  // component logic
});

// Use useMemo for expensive calculations
const cgpa = useMemo(() => calculateCGPA(semesters), [semesters]);

// Use useCallback for stable function references
const handleDelete = useCallback((id: string) => {
  deleteSemester(id);
}, []);

// Lazy load heavy components
const ChartComponent = dynamic(() => import('@/components/GPATrendChart'), {
  loading: () => <Spinner />,
  ssr: false,
});
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority // For above-the-fold images
/>
```

---

## Common Tasks

### Add a New Page

```bash
# Create new page file
mkdir -p app/(dashboard)/analytics
touch app/(dashboard)/analytics/page.tsx
```

```typescript
// app/(dashboard)/analytics/page.tsx
import { getAnalytics } from '@/app/actions/analytics';

export default async function AnalyticsPage() {
  const data = await getAnalytics();
  
  return (
    <div>
      <h1>Analytics</h1>
      {/* content */}
    </div>
  );
}
```

### Add a New Server Action

```typescript
// app/actions/new-feature.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function doSomething(params: SomeType) {
  const supabase = createClient();
  
  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  // Database operation
  const { data, error } = await supabase
    .from('table_name')
    .insert({ ...params, user_id: user.id })
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  // Revalidate
  revalidatePath('/path');
  
  return data;
}
```

### Add a New Component

```typescript
// components/feature/NewComponent.tsx
interface NewComponentProps {
  data: SomeType;
  onAction?: () => void;
}

export function NewComponent({ data, onAction }: NewComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      {/* component content */}
    </div>
  );
}
```

---

## Environment Variables

```bash
# .env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Git Workflow

### Commit Message Format

```
feat: Add semester deletion functionality
fix: Correct GPA calculation rounding
docs: Update README with setup instructions
style: Format code with Prettier
refactor: Extract GPA logic to separate utility
test: Add tests for CGPA calculation
chore: Update dependencies
```

### Branch Naming

```
feature/semester-management
fix/gpa-calculation-bug
docs/api-documentation
refactor/component-structure
```

---

## Key Principles

1. **Server-First**: Use Server Components and Server Actions by default
2. **Type Safety**: Always use TypeScript, avoid `any`
3. **Accessibility**: Ensure keyboard navigation and screen reader support
4. **Performance**: Optimize with memoization, lazy loading, and caching
5. **User Experience**: Fast, responsive, intuitive interface
6. **Data Integrity**: Validate inputs, handle errors gracefully
7. **Security**: Use RLS policies, sanitize inputs, secure auth
8. **Code Quality**: Clean, readable, well-documented code
9. **Testing**: Write tests for critical logic
10. **Consistency**: Follow established patterns and conventions

---

## Quick Reference

### Create Semester
```typescript
await createSemester({ name: 'Fall 2024', year: 2024 });
```

### Add Subject
```typescript
await createSubject({
  semesterId: 'sem-id',
  name: 'Math',
  grade: 'A',
  credits: 4,
});
```

### Calculate GPA
```typescript
const gpa = calculateSemesterGPA(subjects);
```

### Calculate CGPA
```typescript
const cgpa = calculateCGPA(semesters);
```

### Get Performance Level
```typescript
const { level, color } = getPerformanceLevel(gpa);
```

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **Shadcn/ui**: https://ui.shadcn.com
- **PRD**: See `prd.txt` in project root

---

## Notes for AI Assistants

- Always check existing patterns before creating new ones
- Prioritize type safety and error handling
- Use Server Components unless client interactivity is needed
- Follow the established folder structure
- Reference the PRD for feature requirements
- Test calculations thoroughly (GPA/CGPA logic is critical)
- Ensure responsive design (mobile-first approach)
- Maintain accessibility standards (WCAG 2.1 AA)
- Use consistent naming conventions
- Add comments for complex logic

## Grade Management

### Grade Configuration
- Grades are ordered by **points in ascending order** (lowest to highest)
- Each grade has: name, points (0-10), description (optional)
- **No min/max percentage fields** - removed from implementation
- Grade points must be **unique per user** - validation prevents duplicates

### Grade Deletion Behavior
- When deleting a grade, all subjects using it are **automatically reassigned** to the second-highest grade
- System prevents deletion if it's the only grade in the system
- After reassignment, affected semester GPAs are automatically recalculated
- User is warned about automatic reassignment in the confirmation dialog

### Grade CRUD Operations
- **Create**: `createGradeConfig()` - checks for duplicate points before creation
- **Update**: `updateGradeConfig()` - checks for duplicate points (excluding current grade)
- **Delete**: `deleteGradeConfig()` - reassigns subjects to second-highest grade, then deletes
- **List**: `getGradeConfigs()` - returns grades ordered by points (ascending)

### Validation Rules
```typescript
// Grade points must be unique per user
const { data: existingGrades } = await supabase
  .from('grade_configs')
  .select('id')
  .eq('user_id', user.id)
  .eq('points', validated.points)
  .limit(1)

if (existingGrades && existingGrades.length > 0) {
  throw new Error(`A grade with ${validated.points} points already exists`)
}
```

## Theme Management

- Uses **next-themes** for dark/light/system theme support
- ThemeProvider wraps the entire app in `app/layout.tsx`
- ThemeToggle component in settings page allows users to switch themes
- Theme preference is persisted in localStorage

## Semester Management

### Semester CRUD Operations
- **Create**: `createSemester()` - creates a new semester with name, year, and optional term
- **Read**: `getSemesters()` - fetches all semesters ordered by year and order
- **Read Single**: `getSemesterById(id)` - fetches a single semester with all subjects
- **Update**: `updateSemester(id, data)` - updates semester details (name, year, term)
- **Delete**: `deleteSemester(id)` - deletes semester and all associated subjects

### Edit Semester Feature
- Users can edit semester name via `EditSemesterButton` component
- Button appears on the semester detail page alongside Delete and Add Subject buttons
- Opens a dialog with a simple form to update the semester name
- Validates that the name is not empty
- No database structure changes required - uses existing `updateSemester` action
- Shows loading state and toast notifications for success/error
- Automatically refreshes the page after successful update

### Usage Example
```typescript
<EditSemesterButton
  semesterId={id}
  currentName={semester.name}
  variant="outline"
/>
```

## Animations with Framer Motion

The application uses **Framer Motion** for smooth, performant animations throughout the UI. All animations are GPU-accelerated and respect user motion preferences.

### Animation Patterns

#### Container + Item Pattern (Stagger Effects)
Use for lists, grids, or any group of elements that should animate sequentially:

```typescript
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // Delay between each child
      delayChildren: 0.2      // Initial delay before first child
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={item}>
      {/* Content */}
    </motion.div>
  ))}
</motion.div>
```

#### Hover Effects
Standard hover patterns used throughout the app:

```typescript
// Card hover - lift and scale
<motion.div
  whileHover={{ y: -5, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  {/* Card content */}
</motion.div>

// Button hover - scale only
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Button>Click me</Button>
</motion.div>

// Icon rotation on hover
<motion.div
  whileHover={{ rotate: 360 }}
  transition={{ duration: 0.6 }}
>
  <Icon />
</motion.div>
```

#### Entrance Animations
Standard entrance patterns for sections and components:

```typescript
// Fade in from bottom
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
  {/* Content */}
</motion.div>

// Slide in from left (sidebar, modals)
<motion.div
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>

// Scale + fade (emphasis)
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

#### Number Counter Animation
For stats and metrics that should count up:

```typescript
const [displayValue, setDisplayValue] = useState(0)
const targetValue = 42

useEffect(() => {
  const duration = 1000 // 1 second
  const steps = 30
  const increment = targetValue / steps
  let currentStep = 0

  const timer = setInterval(() => {
    currentStep++
    if (currentStep <= steps) {
      setDisplayValue(increment * currentStep)
    } else {
      setDisplayValue(targetValue)
      clearInterval(timer)
    }
  }, duration / steps)

  return () => clearInterval(timer)
}, [targetValue])
```

### Reusable Animation Components

Located in `components/dashboard/DashboardAnimations.tsx`:

```typescript
import { DashboardAnimations, AnimatedSection, AnimatedCard, StaggerContainer } from '@/components/dashboard/DashboardAnimations'

// Wrap entire page for consistent animations
<DashboardAnimations>
  {/* Page content */}
</DashboardAnimations>

// Individual sections with custom delay
<AnimatedSection delay={0.3}>
  {/* Section content */}
</AnimatedSection>

// Cards with hover effects
<AnimatedCard index={0}>
  <Card>{/* Card content */}</Card>
</AnimatedCard>

// Stagger lists
<StaggerContainer>
  {items.map((item, i) => (
    <AnimatedCard key={item.id} index={i}>
      {/* Item content */}
    </AnimatedCard>
  ))}
</StaggerContainer>
```

### Component-Specific Animations

#### Homepage (`app/page.tsx`)
- Header slides down from top on mount
- Logo scales on hover
- Hero section uses staggered entrance for title → description → buttons
- Feature cards appear sequentially with 0.1s stagger
- All cards lift up and scale on hover
- CTA section has delayed entrance

#### Sidebar (`components/layout/Sidebar.tsx`)
- Entire sidebar slides in from left on mount
- Logo section has hover scale effect
- Calculator icon rotates 360° on hover
- Navigation items:
  - Staggered entrance (0.1s per item)
  - Slide right on hover
  - Icons scale + rotate on hover
- Heart icon has infinite pulsing animation: `animate={{ scale: [1, 1.2, 1] }}`

#### StatsCard (`components/dashboard/StatsCard.tsx`)
- Entrance: fade + slide up
- Icon: rotates from -180° to 0° with spring
- Value: animated counter that counts from 0 to target
- Hover: lifts up and scales
- Trend indicators slide in from left

### Animation Best Practices

1. **Always use spring transitions for hover effects**: More natural feel
   ```typescript
   transition={{ type: "spring", stiffness: 300 }}
   ```

2. **Use GPU-accelerated properties**: `transform` and `opacity` only
   - ✅ `x`, `y`, `scale`, `rotate`, `opacity`
   - ❌ `width`, `height`, `margin`, `padding`

3. **Stagger for lists**: Adds polish and helps users track elements
   ```typescript
   transition={{ staggerChildren: 0.1 }}
   ```

4. **Delay entrance animations**: Prevents overwhelming users on page load
   ```typescript
   transition={{ delay: 0.2 }}
   ```

5. **Respect motion preferences**: Framer Motion automatically handles this
   ```typescript
   // No code needed - handled automatically by Framer Motion
   ```

6. **Use variants for complex animations**: Cleaner than inline props
   ```typescript
   const variants = { hidden: {...}, visible: {...} }
   <motion.div variants={variants} initial="hidden" animate="visible">
   ```

7. **Keep animations subtle**: 5-10px movement, 1.02-1.05x scale
   - ✅ `whileHover={{ y: -5, scale: 1.02 }}`
   - ❌ `whileHover={{ y: -50, scale: 1.5 }}`

8. **Animate icons separately from containers**: More engaging
   ```typescript
   <motion.div>
     <motion.div whileHover={{ rotate: 360 }}>
       <Icon />
     </motion.div>
   </motion.div>
   ```

### When to Use Animations

**Always animate:**
- Page/section entrances
- Card hover states
- Button interactions
- Modal/dialog appearances
- List items (with stagger)
- Stats/numbers (counter animation)

**Never animate:**
- Text input fields (distracting)
- Form validation errors (should be instant)
- Critical actions (can delay user)
- High-frequency updates (performance)

### Performance Considerations

- Animations run at 60fps on modern devices
- Use `will-change` sparingly (Framer Motion handles this)
- Avoid animating expensive properties (width, height, etc.)
- Keep animation durations under 600ms
- Disable animations for users who prefer reduced motion (automatic)

### Converting Server to Client Components for Animations

When you need to add animations to a Server Component:

```typescript
// Before: Server Component
export default async function Page() {
  const data = await fetchData()
  return <div>{/* content */}</div>
}

// After: Split into Server + Client
// page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData()
  return <ClientWrapper data={data} />
}

// ClientWrapper.tsx (Client Component)
'use client'
export function ClientWrapper({ data }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* content */}
    </motion.div>
  )
}
```

## UI/UX Enhancements

### Footer Attribution
- Both Sidebar and homepage footer include "Made with ❤️ by ashwinsi" link
- Uses Heart icon from Lucide (red and filled)
- Heart has pulsing animation in sidebar: `animate={{ scale: [1, 1.2, 1] }}`
- Links to https://www.ashwinsi.in
- Opens in new tab with proper security attributes (`target="_blank"` and `rel="noopener noreferrer"`)
- Includes hover effects that transition text color to primary
- **Sidebar**: Located below the "Track Your Success" card at the bottom
- **Homepage**: Located in the footer below the copyright text
