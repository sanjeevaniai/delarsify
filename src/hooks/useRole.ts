import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'survivor' | 'caregiver' | 'clinician' | 'researcher' | 'admin';

export interface RolePermissions {
    canReadOwnProfile: boolean;
    canUpdateOwnProfile: boolean;
    canReadOwnHealthData: boolean;
    canUpdateOwnHealthData: boolean;
    canReadPatientProfiles: boolean;
    canUpdatePatientProfiles: boolean;
    canReadPatientHealthData: boolean;
    canCreateClinicalNotes: boolean;
    canReadClinicalNotes: boolean;
    canReadResearchData: boolean;
    canCreateResearchData: boolean;
    canReadAnonymizedData: boolean;
    canReadCommunityPosts: boolean;
    canCreateCommunityPosts: boolean;
    canModerateCommunityPosts: boolean;
    canManageUserRoles: boolean;
    canManagePermissions: boolean;
}

export const useRole = () => {
    const { user } = useAuth();
    const [role, setRole] = useState<UserRole | null>(null);
    const [permissions, setPermissions] = useState<RolePermissions | null>(null);
    const [loading, setLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState<string>('pending');

    useEffect(() => {
        if (!user) {
            setRole(null);
            setPermissions(null);
            setLoading(false);
            return;
        }

        const loadUserRole = async () => {
            try {
                // Get user role from profiles table
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role, verification_status')
                    .eq('user_id', user.id)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                    console.error('Error loading user role:', profileError);
                    return;
                }

                if (profile) {
                    setRole(profile.role as UserRole);
                    setVerificationStatus(profile.verification_status || 'pending');
                }

                // Load permissions based on role
                if (profile?.role) {
                    const { data: rolePermissions, error: permError } = await supabase
                        .from('role_permissions')
                        .select('permission, resource')
                        .eq('role', profile.role);

                    if (permError) {
                        console.error('Error loading permissions:', permError);
                        return;
                    }

                    // Convert permissions to boolean object
                    const perms: RolePermissions = {
                        canReadOwnProfile: false,
                        canUpdateOwnProfile: false,
                        canReadOwnHealthData: false,
                        canUpdateOwnHealthData: false,
                        canReadPatientProfiles: false,
                        canUpdatePatientProfiles: false,
                        canReadPatientHealthData: false,
                        canCreateClinicalNotes: false,
                        canReadClinicalNotes: false,
                        canReadResearchData: false,
                        canCreateResearchData: false,
                        canReadAnonymizedData: false,
                        canReadCommunityPosts: false,
                        canCreateCommunityPosts: false,
                        canModerateCommunityPosts: false,
                        canManageUserRoles: false,
                        canManagePermissions: false,
                    };

                    rolePermissions?.forEach(perm => {
                        const key = `can${perm.permission.charAt(0).toUpperCase() + perm.permission.slice(1)}${perm.resource.charAt(0).toUpperCase() + perm.resource.slice(1).replace(/_/g, '')}` as keyof RolePermissions;
                        if (key in perms) {
                            (perms as any)[key] = true;
                        }
                    });

                    setPermissions(perms);
                }
            } catch (error) {
                console.error('Error loading user role:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserRole();
    }, [user]);

    const updateUserRole = async (newRole: UserRole, verificationData?: {
        professionalLicense?: string;
        institution?: string;
        specialization?: string;
        verificationDocument?: File;
    }) => {
        if (!user) return false;

        try {
            const updateData: any = {
                role: newRole,
                verification_status: 'pending',
                updated_at: new Date().toISOString(),
            };

            if (verificationData) {
                if (verificationData.professionalLicense) {
                    updateData.professional_license = verificationData.professionalLicense;
                }
                if (verificationData.institution) {
                    updateData.institution = verificationData.institution;
                }
                if (verificationData.specialization) {
                    updateData.specialization = verificationData.specialization;
                }
            }

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    user_id: user.id,
                    ...updateData,
                });

            if (error) {
                console.error('Error updating user role:', error);
                return false;
            }

            // Reload role data
            setRole(newRole);
            return true;
        } catch (error) {
            console.error('Error updating user role:', error);
            return false;
        }
    };

    const hasPermission = (permission: keyof RolePermissions): boolean => {
        return permissions?.[permission] || false;
    };

    const isVerified = verificationStatus === 'verified';
    const isPending = verificationStatus === 'pending';
    const isRejected = verificationStatus === 'rejected';

    return {
        role,
        permissions,
        loading,
        verificationStatus,
        isVerified,
        isPending,
        isRejected,
        updateUserRole,
        hasPermission,
    };
};
