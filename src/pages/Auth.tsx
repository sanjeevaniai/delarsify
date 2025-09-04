import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import RoleSelection from '@/components/RoleSelection';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auth cleanup utility
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      setCurrentUser(null);
      setEmail('');
      setPassword('');
      setDisplayName('');
      toast({
        title: "Signed out successfully",
        description: "You can now sign in with a different account.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clean up auth state before new sign in
      if (!isSignUp) {
        cleanupAuthState();
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (err) {
          // Continue even if this fails
        }
      }

      if (isSignUp) {
        if (!selectedRole) {
          toast({
            title: "Please select a role",
            description: "Choose your role to continue with sign up.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/intake`,
            data: {
              display_name: displayName,
              role: selectedRole
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. After confirming, you'll be redirected to complete your profile setup.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Check if user has completed profile setup
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, intake_completed')
            .eq('user_id', data.user.id)
            .single();

          if (profile?.role && profile?.intake_completed) {
            // User has completed full setup, redirect to dashboard
            window.location.href = '/dashboard';
          } else if (profile?.intake_completed && !profile?.role) {
            // User completed intake but no role, show role selection
            setShowRoleSelection(true);
          } else {
            // User needs to complete intake form first
            window.location.href = '/intake-form';
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show role selection if needed
  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RoleSelection
          onComplete={() => {
            setShowRoleSelection(false);
            window.location.href = '/dashboard';
          }}
          onSkip={() => {
            setShowRoleSelection(false);
            window.location.href = '/dashboard';
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      {/* Home Link */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-primary hover:text-primary/80 rounded-lg shadow-md transition-all duration-200 font-medium"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
      {/* Background decorative elements */}

      {/* Current user indicator and sign out */}
      {currentUser && (
        <div className="absolute top-4 right-4 z-20">
          <Card className="glass-card border border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="text-sm">
                <p className="text-muted-foreground">Signed in as:</p>
                <p className="font-medium text-foreground">{currentUser.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      <Card className="w-full max-w-md glass-card border border-gray-200 relative z-10 transition-all duration-200">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Join DeLARSify Community
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Connect with others and chat with SIA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAuth} className="space-y-6">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm font-semibold text-foreground">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How should we call you?"
                    required={isSignUp}
                    className="h-12 bg-white/80 border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Select Your Role
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedRole === 'survivor'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/50'
                        }`}
                      onClick={() => setSelectedRole('survivor')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedRole === 'survivor'
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                          }`}></div>
                        <div>
                          <p className="font-medium">Cancer Survivor</p>
                          <p className="text-sm text-muted-foreground">I am managing my own health journey</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedRole === 'caregiver'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/50'
                        }`}
                      onClick={() => setSelectedRole('caregiver')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedRole === 'caregiver'
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                          }`}></div>
                        <div>
                          <p className="font-medium">Caregiver</p>
                          <p className="text-sm text-muted-foreground">I support someone with LARS</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedRole === 'clinician'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/50'
                        }`}
                      onClick={() => setSelectedRole('clinician')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedRole === 'clinician'
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                          }`}></div>
                        <div>
                          <p className="font-medium">Clinician</p>
                          <p className="text-sm text-muted-foreground">I provide healthcare services</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedRole === 'researcher'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/50'
                        }`}
                      onClick={() => setSelectedRole('researcher')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedRole === 'researcher'
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                          }`}></div>
                        <div>
                          <p className="font-medium">Researcher</p>
                          <p className="text-sm text-muted-foreground">I conduct research in this field</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="h-12 bg-white/80 border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-12 bg-white/80 border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                isSignUp ? "Sign Up" : "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Need an account? Sign up"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;