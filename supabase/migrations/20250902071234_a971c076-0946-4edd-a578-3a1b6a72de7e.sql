-- Create comprehensive user profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Information
  full_name TEXT,
  email TEXT,
  country TEXT,
  age INTEGER,
  gender TEXT,
  
  -- Medical History
  colorectal_cancer_stage TEXT, -- Stage I, II, III, IV, Unknown
  diagnosis_date DATE,
  primary_tumor_location TEXT, -- Rectum, Sigmoid, Left colon, Right colon, etc.
  
  -- Treatment History
  underwent_surgery BOOLEAN DEFAULT false,
  surgery_type TEXT, -- LAR, APR, Hartmann, etc.
  surgery_date DATE,
  anastomosis_height_cm INTEGER, -- Distance from anal verge
  
  underwent_chemotherapy BOOLEAN DEFAULT false,
  chemo_regimen TEXT,
  chemo_start_date DATE,
  chemo_end_date DATE,
  
  underwent_radiation BOOLEAN DEFAULT false,
  radiation_type TEXT, -- Neoadjuvant, Adjuvant
  radiation_start_date DATE,
  radiation_end_date DATE,
  
  -- Stoma Information
  has_stoma BOOLEAN DEFAULT false,
  stoma_type TEXT, -- Ileostomy, Colostomy, Urostomy
  stoma_temporary BOOLEAN DEFAULT false,
  stoma_creation_date DATE,
  stoma_reversal_date DATE,
  
  -- Current Symptoms & Quality of Life
  current_lars_score INTEGER,
  primary_symptoms TEXT[], -- Array of symptoms
  symptom_severity INTEGER CHECK (symptom_severity >= 1 AND symptom_severity <= 10),
  quality_of_life_score INTEGER CHECK (quality_of_life_score >= 1 AND quality_of_life_score <= 10),
  
  -- Lifestyle Factors
  diet_restrictions TEXT[],
  current_medications TEXT[],
  exercise_frequency TEXT,
  support_system_rating INTEGER CHECK (support_system_rating >= 1 AND support_system_rating <= 5),
  
  -- Intake completion
  intake_completed BOOLEAN DEFAULT false,
  intake_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Create AI recommendations table
CREATE TABLE public.ai_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Recommendation content
  recommendation_text TEXT NOT NULL,
  recommendation_type TEXT NOT NULL, -- dietary, exercise, medical, lifestyle
  priority INTEGER NOT NULL DEFAULT 1, -- 1=high, 2=medium, 3=low
  
  -- Based on intake data
  based_on_symptoms TEXT[],
  based_on_treatment_history TEXT[],
  confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Follow-up
  implemented BOOLEAN DEFAULT false,
  helpful_rating INTEGER CHECK (helpful_rating >= 1 AND helpful_rating <= 5),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for recommendations
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for recommendations
CREATE POLICY "Users can view their own recommendations"
ON public.ai_recommendations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
ON public.ai_recommendations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations"
ON public.ai_recommendations
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at
BEFORE UPDATE ON public.ai_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New User')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created_create_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_signup();