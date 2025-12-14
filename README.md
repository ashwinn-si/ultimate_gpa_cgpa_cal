# 🎓 CGPA/GPA Calculator - Web Application

A modern, full-stack web application for calculating and tracking student GPA (Grade Point Average) and CGPA (Cumulative Grade Point Average) across semesters. Built with **Next.js 14**, **TypeScript**, **TailwindCSS**, and **Supabase**.

## ✨ Features

- 📊 **Semester Management** - Create, edit, and delete academic semesters
- 📚 **Subject Tracking** - Manage subjects with grades and credits
- 🧮 **Automatic Calculations** - Real-time GPA and CGPA calculations
- 📈 **Performance Analytics** - Visualize your academic progress
- 🎨 **Beautiful UI** - Modern, responsive design with dark mode
- 🔐 **Secure Authentication** - Email/password and OAuth support
- ☁️ **Cloud Sync** - Your data synced across devices
- 📱 **Mobile Responsive** - Works perfectly on all devices

## 🚀 Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Shadcn/ui**
- **Framer Motion**
- **Recharts**

### Backend
- **Supabase** (PostgreSQL + Auth + Realtime)
- **Next.js Server Actions**

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd untimate_gpa_cgpa_cal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up Supabase Database

Run the following SQL in your Supabase SQL editor to create the required tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Semesters table
CREATE TABLE semesters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    term VARCHAR(20),
    gpa DECIMAL(4, 2) DEFAULT 0,
    total_credits DECIMAL(5, 1) DEFAULT 0,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Subjects table
CREATE TABLE subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    grade_points DECIMAL(4, 2) NOT NULL,
    credits DECIMAL(4, 1) NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Grade configurations table
CREATE TABLE grade_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(10) NOT NULL,
    points DECIMAL(4, 2) NOT NULL,
    description VARCHAR(100),
    min_percentage DECIMAL(5, 2),
    max_percentage DECIMAL(5, 2),
    "order" INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User settings table
CREATE TABLE user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    theme VARCHAR(10) DEFAULT 'auto',
    default_grading_system VARCHAR(20) DEFAULT '10-point',
    decimal_precision INTEGER DEFAULT 2,
    include_failed_courses BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Semesters policies
CREATE POLICY "Users can view their own semesters" ON semesters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own semesters" ON semesters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own semesters" ON semesters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own semesters" ON semesters
    FOR DELETE USING (auth.uid() = user_id);

-- Subjects policies (check semester ownership)
CREATE POLICY "Users can view subjects in their semesters" ON subjects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM semesters 
            WHERE semesters.id = subjects.semester_id 
            AND semesters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert subjects in their semesters" ON subjects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM semesters 
            WHERE semesters.id = subjects.semester_id 
            AND semesters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update subjects in their semesters" ON subjects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM semesters 
            WHERE semesters.id = subjects.semester_id 
            AND semesters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete subjects in their semesters" ON subjects
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM semesters 
            WHERE semesters.id = subjects.semester_id 
            AND semesters.user_id = auth.uid()
        )
    );

-- Grade configs policies
CREATE POLICY "Users can view their own grade configs" ON grade_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grade configs" ON grade_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grade configs" ON grade_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grade configs" ON grade_configs
    FOR DELETE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_semesters_user_id ON semesters(user_id);
CREATE INDEX idx_subjects_semester_id ON subjects(semester_id);
CREATE INDEX idx_grade_configs_user_id ON grade_configs(user_id);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_semesters_updated_at BEFORE UPDATE ON semesters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grade_configs_updated_at BEFORE UPDATE ON grade_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── actions/           # Server Actions
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── layout/           # Layout components
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase clients
│   └── utils/            # Helper functions
├── types/                 # TypeScript types
└── public/               # Static assets
```

## 🔑 Key Features Explained

### GPA Calculation
```typescript
GPA = Σ(Grade Points × Credits) / Σ(Credits)
```

### CGPA Calculation
```typescript
CGPA = Σ(All Grade Points × Credits) / Σ(All Credits)
```

## 🎨 Customization

### Grading Systems

The app supports multiple grading systems:
- **10-Point Scale** (Default)
- **4-Point Scale** (US Standard)
- **Custom grades**

### Theme Support

- Light mode
- Dark mode
- Auto (follows system preference)

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy!

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For support, email support@example.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Next.js Team
- Supabase Team
- Shadcn for the amazing UI components
- All contributors

---

Built with ❤️ using Next.js and Supabase
