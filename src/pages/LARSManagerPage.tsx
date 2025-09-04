import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, TrendingUp, TrendingDown, AlertCircle, CheckCircle, ArrowLeft, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LARSSymptomTracker from '@/components/LARSSymptomTracker';
import LARSScoreCalculator from '@/components/LARSScoreCalculator';
import MicrobiomeAnalysis from '@/components/MicrobiomeAnalysis';
import DietaryRecommendations from '@/components/DietaryRecommendations';
import RoleGuard from '@/components/RoleGuard';

interface User {
    id: string;
    email?: string;
}

const LARSManagerPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);

                    // Get user role
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('user_id', session.user.id)
                        .single();

                    setUserRole(profile?.role || null);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

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
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading LARS Manager...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>
                            You need to sign in to access the LARS Manager.
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Button>
                            <div className="h-6 w-px bg-gray-300" />
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                <h1 className="text-xl font-semibold text-primary">LARS Manager</h1>
                                {userRole && (
                                    <Badge variant="outline" className="ml-2">
                                        {userRole}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-primary mb-4">
                        Welcome to LARS Manager
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Comprehensive tools for managing Low Anterior Resection Syndrome.
                        {userRole === 'clinician' && ' Access patient data and clinical tools.'}
                        {userRole === 'researcher' && ' Access research tools and data analysis.'}
                        {userRole === 'survivor' && ' Track your symptoms and manage your LARS journey.'}
                        {userRole === 'caregiver' && ' Support your loved one through their LARS journey.'}
                    </p>
                </div>

                {/* Role-specific Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Symptom Entries</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                +2 from last week
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current LARS Score</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">28</div>
                            <p className="text-xs text-muted-foreground">
                                Minor LARS
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Progress</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Good</div>
                            <p className="text-xs text-muted-foreground">
                                Keep up the great work!
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                        <TabsTrigger value="score">LARS Score</TabsTrigger>
                        <TabsTrigger value="microbiome">Microbiome</TabsTrigger>
                        <TabsTrigger value="diet">Diet</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>
                                        Your latest LARS management activities
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Symptom entry completed</p>
                                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">LARS score calculated</p>
                                                <p className="text-xs text-muted-foreground">1 day ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Dietary recommendation updated</p>
                                                <p className="text-xs text-muted-foreground">3 days ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>
                                        Common tasks and tools
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => document.querySelector('[value="symptoms"]')?.click()}
                                        >
                                            <CalendarDays className="w-4 h-4 mr-2" />
                                            Log Symptoms
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => document.querySelector('[value="score"]')?.click()}
                                        >
                                            <TrendingUp className="w-4 h-4 mr-2" />
                                            Calculate LARS Score
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => document.querySelector('[value="diet"]')?.click()}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            View Diet Recommendations
                                        </Button>
                                        {userRole === 'researcher' && (
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start"
                                                onClick={() => document.querySelector('[value="microbiome"]')?.click()}
                                            >
                                                <AlertCircle className="w-4 h-4 mr-2" />
                                                Microbiome Analysis
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Research Highlights */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingDown className="w-5 h-5 mr-2 text-primary" />
                                    Research Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-sm">
                                        <p className="font-medium">Key Findings:</p>
                                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                            <li>• Butyricicoccus levels correlate with symptom severity</li>
                                            <li>• Frequency-dominant LARS shows decreased gut diversity</li>
                                            <li>• Lactobacillus & Bifidobacterium reduction noted</li>
                                            <li>• Prevotellaceae vs Bacteroidaceae enterotype patterns</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="symptoms">
                        <LARSSymptomTracker />
                    </TabsContent>

                    <TabsContent value="score">
                        <LARSScoreCalculator />
                    </TabsContent>

                    <TabsContent value="microbiome">
                        {userRole === 'researcher' || userRole === 'clinician' ? (
                            <MicrobiomeAnalysis />
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                                        Access Restricted
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Microbiome Analysis is only available to researchers and clinicians.
                                        Contact your healthcare provider for microbiome-related information.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="diet">
                        <DietaryRecommendations />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default LARSManagerPage;
