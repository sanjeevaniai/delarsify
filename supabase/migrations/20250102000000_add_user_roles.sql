-- Add user roles and permissions system
-- This migration adds role-based access control for PHI compliance

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('survivor', 'caregiver', 'clinician', 'researcher', 'admin')),
  verified BOOLEAN DEFAULT FALSE,
  verification_document_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('survivor', 'caregiver', 'clinician', 'researcher', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_document_path TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS professional_license TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS institution TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialization TEXT;

-- Add role column to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('survivor', 'caregiver', 'clinician', 'researcher', 'admin'));
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- Create permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  permission TEXT NOT NULL,
  resource TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, permission, resource)
);

-- Insert default permissions
INSERT INTO role_permissions (role, permission, resource) VALUES
-- Survivor permissions
('survivor', 'read', 'own_profile'),
('survivor', 'update', 'own_profile'),
('survivor', 'read', 'own_health_data'),
('survivor', 'update', 'own_health_data'),
('survivor', 'read', 'community_posts'),
('survivor', 'create', 'community_posts'),
('survivor', 'read', 'general_resources'),

-- Caregiver permissions (same as survivor for now)
('caregiver', 'read', 'own_profile'),
('caregiver', 'update', 'own_profile'),
('caregiver', 'read', 'own_health_data'),
('caregiver', 'update', 'own_health_data'),
('caregiver', 'read', 'community_posts'),
('caregiver', 'create', 'community_posts'),
('caregiver', 'read', 'general_resources'),

-- Clinician permissions
('clinician', 'read', 'own_profile'),
('clinician', 'update', 'own_profile'),
('clinician', 'read', 'patient_profiles'),
('clinician', 'update', 'patient_profiles'),
('clinician', 'read', 'patient_health_data'),
('clinician', 'create', 'clinical_notes'),
('clinician', 'read', 'clinical_notes'),
('clinician', 'read', 'research_data'),
('clinician', 'read', 'community_posts'),
('clinician', 'create', 'community_posts'),
('clinician', 'moderate', 'community_posts'),

-- Researcher permissions
('researcher', 'read', 'own_profile'),
('researcher', 'update', 'own_profile'),
('researcher', 'read', 'anonymized_data'),
('researcher', 'read', 'research_data'),
('researcher', 'create', 'research_data'),
('researcher', 'read', 'community_posts'),
('researcher', 'create', 'community_posts'),
('researcher', 'read', 'clinical_notes'),

-- Admin permissions
('admin', 'read', 'all_profiles'),
('admin', 'update', 'all_profiles'),
('admin', 'delete', 'all_profiles'),
('admin', 'read', 'all_health_data'),
('admin', 'moderate', 'community_posts'),
('admin', 'manage', 'user_roles'),
('admin', 'manage', 'permissions');

-- Create audit log table for PHI compliance
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for role_permissions
CREATE POLICY "All authenticated users can view permissions" ON role_permissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS policies for audit_logs
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles 
    WHERE user_id = user_uuid 
    ORDER BY created_at DESC 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check permission
CREATE OR REPLACE FUNCTION has_permission(
  user_uuid UUID,
  permission_name TEXT,
  resource_name TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN profiles p ON p.role = rp.role
    WHERE p.user_id = user_uuid 
    AND rp.permission = permission_name 
    AND rp.resource = resource_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
