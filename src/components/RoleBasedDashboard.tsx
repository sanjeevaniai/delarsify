import { useRole } from '@/hooks/useRole';
import SurvivorDashboard from './dashboards/SurvivorDashboard';
import CaregiverDashboard from './dashboards/CaregiverDashboard';
import ClinicianDashboard from './dashboards/ClinicianDashboard';
import ResearcherDashboard from './dashboards/ResearcherDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleBasedDashboard = () => {
    const { role, loading, isVerified, isPending, isRejected } = useRole();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!role) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <CardTitle>Profile Setup Required</CardTitle>
                        <CardDescription>
                            Please complete your profile setup to access your personalized dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <Button onClick={() => navigate('/intake-form')} className="w-full">
                            Complete Profile Setup
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="w-full"
                        >
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isRejected) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <CardTitle>Verification Rejected</CardTitle>
                        <CardDescription>
                            Your role verification has been rejected. Please contact support or update your profile.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <Button onClick={() => navigate('/intake-form')} className="w-full">
                            Update Profile
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="w-full"
                        >
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                        <CardTitle>Verification Pending</CardTitle>
                        <CardDescription>
                            Your {role} account is being verified. You'll receive an email once verification is complete.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> Some features may be limited until verification is complete.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="w-full"
                        >
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Render appropriate dashboard based on role
    switch (role) {
        case 'survivor':
            return <SurvivorDashboard />;
        case 'caregiver':
            return <CaregiverDashboard />;
        case 'clinician':
            return <ClinicianDashboard />;
        case 'researcher':
            return <ResearcherDashboard />;
        case 'admin':
            return <ClinicianDashboard />; // Admin can use clinician dashboard for now
        default:
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader className="text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <CardTitle>Invalid Role</CardTitle>
                            <CardDescription>
                                Your account has an invalid role. Please contact support.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button onClick={() => navigate('/intake-form')} className="w-full">
                                Update Profile
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
    }
};

export default RoleBasedDashboard;
