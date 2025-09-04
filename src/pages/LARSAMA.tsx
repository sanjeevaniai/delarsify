import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import ChatInterface from '@/components/ChatInterface';
import SimplePaperManagement from '@/components/SimplePaperManagement';
import { LogIn, Bot, LogOut, User, ArrowLeft, MessageSquare, Database } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const LARSAMA = () => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState<string>('');
    const { toast } = useToast();
    const navigate = useNavigate();

    const suggestedQuestions = [
        "What is LARS and how does it develop?",
        "Will my symptoms ever get better over time?",
        "What diagnostic tests are commonly used for LARS?",
        "How do I discuss LARS with my family and friends?",
        "What dietary modifications help manage LARS symptoms?",
        "How can I manage unpredictable bowel movements?",
        "What are the latest treatment options for LARS?",
        "How does LARS affect my quality of life?",
        "What should I expect during LARS recovery?",
        "Are there any new research findings about LARS?",
        "How can I prepare for LARS surgery?",
        "What support groups are available for LARS patients?"
    ];

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleSuggestedQuestion = (question: string) => {
        setSelectedQuestion(question);
        // Reset after the ChatInterface picks it up
        setTimeout(() => setSelectedQuestion(''), 1000);
    };

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            toast({
                title: "Signed out successfully",
                description: "You have been signed out of your account.",
            });
        } catch (error: any) {
            toast({
                title: "Error signing out",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Bot className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
                    <p className="text-muted-foreground">Loading LARS AMA Agent...</p>
                </div>
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
                            <h1 className="text-xl font-semibold text-primary">LARS AMA Agent</h1>
                        </div>

                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <User className="w-4 h-4" />
                                    <span className="hidden sm:inline">{user.email}</span>
                                </div>
                                <Button
                                    onClick={handleSignOut}
                                    variant="outline"
                                    size="sm"
                                    className="border-primary text-primary hover:bg-primary hover:text-white"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Content */}
                {user ? (
                    <>
                        {/* User Info */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm border">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-primary" />
                                    <span className="text-sm text-muted-foreground">Signed in as: </span>
                                    <span className="font-medium">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Interface with Tabs */}
                        <div className="max-w-7xl mx-auto">
                            <Tabs defaultValue="chat" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-8">
                                    <TabsTrigger value="chat" className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Chat with SIA
                                    </TabsTrigger>
                                    <TabsTrigger value="papers" className="flex items-center gap-2">
                                        <Database className="w-4 h-4" />
                                        Research Papers
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="chat">
                                    {/* Main Chat Interface */}
                                    <div className="bg-white rounded-lg shadow-sm border max-w-4xl mx-auto mb-8">
                                        <ChatInterface user={user} suggestedQuestion={selectedQuestion} />
                                    </div>

                                    {/* Suggested Questions */}
                                    <div className="text-center mb-8">
                                        <p className="text-muted-foreground mb-4">Try asking SIA about:</p>
                                        <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                                            {suggestedQuestions.map((question, index) => (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    className="text-sm hover:bg-primary hover:text-white transition-all duration-200"
                                                    onClick={() => handleSuggestedQuestion(question)}
                                                >
                                                    "{question}"
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="papers">
                                    <SimplePaperManagement />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </>
                ) : (
                    /* Login Prompt */
                    <div className="bg-white rounded-lg shadow-sm border max-w-2xl mx-auto text-center p-12">
                        <img
                            src="/sia-avatar.png"
                            alt="SIA Avatar"
                            className="w-16 h-16 mx-auto mb-6 rounded-full object-cover"
                        />
                        <h3 className="text-2xl font-semibold text-primary mb-4">
                            LARS AMA Agent - Evidence Synthesis
                        </h3>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            The LARS AMA Agent synthesizes the latest evidence into patient- and clinician-friendly guidance for LARS management.
                            Sign in to access evidence-based answers and personalized recommendations.
                        </p>
                        <Button
                            onClick={() => navigate('/auth')}
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            <LogIn className="h-4 w-4 mr-2" />
                            Access LARS AMA Agent
                        </Button>
                    </div>
                )}

                {/* Features Preview */}
                <div className="grid md:grid-cols-4 gap-6 mt-16">
                    <Card className="p-6 text-center">
                        <Bot className="h-8 w-8 mx-auto mb-4 text-primary" />
                        <h4 className="font-semibold text-primary mb-2">Evidence Synthesis</h4>
                        <p className="text-sm text-muted-foreground">Transforms complex medical evidence into clear, actionable guidance</p>
                    </Card>

                    <Card className="p-6 text-center">
                        <div className="h-8 w-8 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">24/7</span>
                        </div>
                        <h4 className="font-semibold text-primary mb-2">Personalized Support</h4>
                        <p className="text-sm text-muted-foreground">Provides tailored recommendations based on your specific situation</p>
                    </Card>

                    <Card className="p-6 text-center">
                        <div className="h-8 w-8 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">📚</span>
                        </div>
                        <h4 className="font-semibold text-primary mb-2">Clinician-Ready</h4>
                        <p className="text-sm text-muted-foreground">Detailed clinical insights for healthcare professionals</p>
                    </Card>

                    <Card className="p-6 text-center">
                        <div className="h-8 w-8 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">🔬</span>
                        </div>
                        <h4 className="font-semibold text-primary mb-2">Research-Based</h4>
                        <p className="text-sm text-muted-foreground">Based on latest scientific research and clinical studies</p>
                    </Card>
                </div>

                {/* Research Integration Section */}
                <div className="mt-16">
                    <Card className="p-8">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-primary mb-4">Evidence-Based Knowledge Base</h3>
                            <p className="text-muted-foreground max-w-3xl mx-auto">
                                Our LARS AMA Agent is powered by the latest scientific research and clinical evidence, ensuring you receive accurate, up-to-date information.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h4 className="font-semibold text-primary mb-2">Clinical Studies</h4>
                                <p className="text-sm text-muted-foreground">Access to 500+ peer-reviewed studies on LARS management</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🏥</span>
                                </div>
                                <h4 className="font-semibold text-primary mb-2">Expert Guidelines</h4>
                                <p className="text-sm text-muted-foreground">Based on international medical society recommendations</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <h4 className="font-semibold text-primary mb-2">Real-time Updates</h4>
                                <p className="text-sm text-muted-foreground">Continuously updated with latest research findings</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Key Research Areas */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-center text-primary mb-8">Key Research Areas Covered</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            "Surgical Techniques & Outcomes",
                            "Microbiome & Gut Health",
                            "Quality of Life Studies",
                            "Dietary Interventions",
                            "Pharmacological Treatments",
                            "Rehabilitation Programs",
                            "Psychological Support",
                            "Long-term Follow-up"
                        ].map((area, index) => (
                            <div key={index} className="bg-white/50 rounded-lg p-4 text-center border border-primary/20">
                                <p className="text-sm font-medium text-primary">{area}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LARSAMA;
