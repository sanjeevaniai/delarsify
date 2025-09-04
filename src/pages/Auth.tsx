import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, Home, Mail, Smartphone, User } from 'lucide-react';
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
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'otp'>('email');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
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

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) throw error;

      toast({
        title: "Redirecting to Google",
        description: "Please complete authentication with Google.",
      });
    } catch (error: any) {
      toast({
        title: "Google Sign-in Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!email && !phoneNumber) {
      toast({
        title: "Email or Phone Required",
        description: "Please enter your email address or phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email || undefined,
        phone: phoneNumber || undefined,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "Code Sent",
        description: `We've sent a verification code to ${email || phoneNumber}`,
      });
    } catch (error: any) {
      toast({
        title: "Error Sending Code",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode) {
      toast({
        title: "Code Required",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email || undefined,
        phone: phoneNumber || undefined,
        token: otpCode,
        type: 'email'
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
          window.location.href = '/dashboard';
        } else if (profile?.intake_completed && !profile?.role) {
          setShowRoleSelection(true);
        } else {
          window.location.href = '/intake-form';
        }
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          {/* Authentication Method Selector */}
          <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                authMethod === 'email'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('google')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                authMethod === 'google'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Google
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('otp')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                authMethod === 'otp'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-4 h-4 inline mr-2" />
              OTP
            </button>
          </div>

          {/* Google Authentication */}
          {authMethod === 'google' && (
            <div className="space-y-4">
              <Button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-gray-400 font-semibold text-lg rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Sign in with your Google account for quick access
              </p>
            </div>
          )}

          {/* OTP Authentication */}
          {authMethod === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email-otp" className="text-sm font-semibold text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email-otp"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="h-12 bg-white/80 border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    OR
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-otp" className="text-sm font-semibold text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone-otp"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="h-12 bg-white/80 border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isLoading || (!email && !phoneNumber)}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending Code...
                      </div>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      We sent a verification code to:
                    </p>
                    <p className="font-medium text-foreground">{email || phoneNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp-code" className="text-sm font-semibold text-foreground">
                      Verification Code
                    </Label>
                    <Input
                      id="otp-code"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="h-12 bg-white/80 border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground text-center text-lg tracking-widest"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={isLoading || !otpCode}
                      className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Verifying...
                        </div>
                      ) : (
                        "Verify Code"
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                      }}
                      variant="outline"
                      className="h-12 px-4"
                    >
                      Back
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Email/Password Authentication */}
          {authMethod === 'email' && (
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
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;