import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import LARSSymptomTracker from "@/components/LARSSymptomTracker";
import LARSScoreCalculator from "@/components/LARSScoreCalculator";
import MicrobiomeAnalysis from "@/components/MicrobiomeAnalysis";
import DietaryRecommendations from "@/components/DietaryRecommendations";

interface User {
  id: string;
  email?: string;
}

const LARSManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading LARS Manager...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto mt-20">
            <CardHeader className="text-center">
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please sign in to access your LARS management dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Redirect to intake if not completed
  if (profile && !profile.intake_completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto mt-20">
            <CardHeader className="text-center">
              <CardTitle>Complete Your Medical Intake</CardTitle>
              <CardDescription>
                Help us provide personalized recommendations by completing your medical intake assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => window.location.href = '/intake'}>
                Start Intake Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              LARS Manager
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Evidence-based Low Anterior Resection Syndrome management platform based on the latest scientific research
            </p>
            <div className="flex justify-center items-center mt-4 space-x-2">
              <Badge variant="secondary" className="text-sm">
                <CalendarDays className="w-4 h-4 mr-1" />
                Based on 2023 Scientific Reports
              </Badge>
              <Badge variant="outline" className="text-sm">
                16S rRNA Microbiome Analysis
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="symptoms">Symptom Tracking</TabsTrigger>
              <TabsTrigger value="score">LARS Score</TabsTrigger>
              <TabsTrigger value="microbiome">Microbiome Analysis</TabsTrigger>
              <TabsTrigger value="diet">Diet & Nutrition</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                      Recent Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall LARS Score</span>
                          <span>24/42</span>
                        </div>
                        <Progress value={57} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">Minor LARS (21-29)</p>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Symptom Improvement</span>
                          <span>+12%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">vs last month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <p className="text-sm">Frequency-dominant symptoms detected</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                        <p className="text-sm">Recommend microbiome diversity assessment</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <p className="text-sm">Diet modifications showing positive impact</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Research Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingDown className="w-5 h-5 mr-2 text-blue-500" />
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
              </div>
            </TabsContent>

            <TabsContent value="symptoms">
              <LARSSymptomTracker />
            </TabsContent>

            <TabsContent value="score">
              <LARSScoreCalculator />
            </TabsContent>

            <TabsContent value="microbiome">
              <MicrobiomeAnalysis />
            </TabsContent>

            <TabsContent value="diet">
              <DietaryRecommendations />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LARSManager;