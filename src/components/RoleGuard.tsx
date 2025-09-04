import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowLeft, User, AlertTriangle } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: ('survivor' | 'caregiver' | 'clinician' | 'researcher')[];
    fallbackMessage?: string;
    requireAuth?: boolean;
}

const RoleGuard = ({
    children,
    allowedRoles,
    fallbackMessage,
    requireAuth = true
}: RoleGuardProps) => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndRole = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session?.user) {
                    if (requireAuth) {
                        setLoading(false);
                        return;
                    }
                } else {
                    setUser(session.user);

                    // Get user role from profiles table
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('user_id', session.user.id)
                        .single();

                    setUserRole(profile?.role || null);
                }
            } catch (error) {
                console.error('Error checking auth and role:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndRole();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setUserRole(null);
                } else if (session?.user) {
                    setUser(session.user);

                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('user_id', session.user.id)
                        .single();

                    setUserRole(profile?.role || null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [requireAuth]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
                    <p className="text-muted-foreground">Checking access permissions...</p>
                </div>
            </div>
        );
    }

    // Not authenticated and auth is required
    if (requireAuth && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>
                            You need to sign in to access this feature.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={() => navigate('/auth')}
                            className="w-full"
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="w-full"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Authenticated but no role assigned
    if (user && !userRole) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <User className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <CardTitle>Profile Setup Required</CardTitle>
                        <CardDescription>
                            Please complete your profile setup to access this feature.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={() => navigate('/intake-form')}
                            className="w-full"
                        >
                            Complete Profile Setup
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="w-full"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Check if user role is allowed
    if (user && userRole && !allowedRoles.includes(userRole as any)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                        <CardTitle>Access Restricted</CardTitle>
                        <CardDescription>
                            {fallbackMessage || `This feature is only available to ${allowedRoles.join(', ')}.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Your current role: <strong>{userRole}</strong>
                            </AlertDescription>
                        </Alert>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
                            className="w-full"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Access granted
    return <>{children}</>;
};

export default RoleGuard;
