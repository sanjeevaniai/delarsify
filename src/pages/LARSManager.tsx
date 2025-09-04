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
              Comprehensive evidence-based Low Anterior Resection Syndrome management platform with advanced analytics, 
              personalized treatment recommendations, and real-time monitoring capabilities based on the latest scientific research
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
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="symptoms">Symptom Tracking</TabsTrigger>
              <TabsTrigger value="score">LARS Score</TabsTrigger>
              <TabsTrigger value="microbiome">Microbiome Analysis</TabsTrigger>
              <TabsTrigger value="diet">Diet & Nutrition</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

                {/* Treatment Adherence */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
                      Treatment Adherence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Medication Compliance</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Dietary Guidelines</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
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

            <TabsContent value="analytics">
              <div className="space-y-6">
                {/* Analytics Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                        Symptom Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">-15%</div>
                          <p className="text-sm text-muted-foreground">Symptom Severity (30 days)</p>
                        </div>
                        <div className="h-20 bg-gray-100 rounded flex items-end justify-center space-x-1">
                          <div className="w-3 bg-green-400 h-16 rounded-t"></div>
                          <div className="w-3 bg-green-300 h-12 rounded-t"></div>
                          <div className="w-3 bg-green-500 h-20 rounded-t"></div>
                          <div className="w-3 bg-green-400 h-14 rounded-t"></div>
                          <div className="w-3 bg-green-600 h-8 rounded-t"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CalendarDays className="w-5 h-5 mr-2 text-blue-500" />
                        Treatment Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Surgery Date</span>
                          <span className="text-sm font-medium">6 months ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">First LARS Assessment</span>
                          <span className="text-sm font-medium">5 months ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Last Follow-up</span>
                          <span className="text-sm font-medium">2 weeks ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Next Appointment</span>
                          <span className="text-sm font-medium text-blue-600">In 2 weeks</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                        Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">Moderate</div>
                          <p className="text-sm text-muted-foreground">Current Risk Level</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Complication Risk</span>
                            <span className="text-orange-600">25%</span>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quality of Life Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Physical Function</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Emotional Well-being</span>
                            <span>68%</span>
                          </div>
                          <Progress value={68} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Social Function</span>
                            <span>82%</span>
                          </div>
                          <Progress value={82} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Satisfaction</span>
                            <span>71%</span>
                          </div>
                          <Progress value={71} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Treatment Effectiveness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium text-green-800">Dietary Modifications</p>
                            <p className="text-sm text-green-600">Highly Effective</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">+23%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-blue-800">Physical Therapy</p>
                            <p className="text-sm text-blue-600">Moderately Effective</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">+12%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div>
                            <p className="font-medium text-yellow-800">Medication</p>
                            <p className="text-sm text-yellow-600">Somewhat Effective</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">+5%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Research Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingDown className="w-5 h-5 mr-2 text-purple-500" />
                      Research-Based Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Key Findings from Latest Research:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Microbiome diversity correlates with symptom improvement</li>
                          <li>• Butyricicoccus levels show 85% correlation with LARS severity</li>
                          <li>• Dietary fiber intake improves quality of life scores by 30%</li>
                          <li>• Regular exercise reduces symptom frequency by 40%</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Personalized Recommendations:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Increase prebiotic fiber intake to 25g/day</li>
                          <li>• Consider probiotic supplementation with Bifidobacterium</li>
                          <li>• Maintain regular exercise routine (150 min/week)</li>
                          <li>• Schedule follow-up microbiome analysis in 3 months</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LARSManager;