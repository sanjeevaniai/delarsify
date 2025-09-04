import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Users, Bot, LogOut, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import CommunityPosts from '@/components/CommunityPosts';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@supabase/supabase-js';

const Community = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('chat');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/auth');
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <div className="hidden sm:flex items-center gap-3">
              <Link 
                to="/who-are-we" 
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-all duration-300"
              >
                Who Are We
              </Link>
              <Link 
                to="/founders-story" 
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-all duration-300"
              >
                Founder's Story
              </Link>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">DeLARSify Community</h1>
              <p className="text-sm text-muted-foreground">Healing Intelligence</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Welcome Card */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Welcome to the DeLARSify Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with fellow LARS survivors, share experiences, and get personalized support from SIA (SANJEEVANI Intelligence Assistant).
              </p>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Chat with SIA
                </TabsTrigger>
                <TabsTrigger value="community" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Community Posts
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-6">
                <ChatInterface user={user} />
              </TabsContent>
              
              <TabsContent value="community" className="mt-6">
                <CommunityPosts user={user} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;