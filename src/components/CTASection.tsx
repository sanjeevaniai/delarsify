
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Radio, Mail, PenTool, Heart } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();
  const ctaButtons = [
    {
      id: 'science',
      title: 'Read Our Latest Science',
      subtitle: 'Evidence-based insights',
      icon: BookOpen,
      color: 'from-sanjeevani-blue to-sanjeevani-lavender',
      action: '#publications'
    },
    {
      id: 'newsletter',
      title: 'Join Our Newsletter',
      subtitle: 'Weekly healing insights',
      icon: Mail,
      color: 'from-sanjeevani-mint to-sanjeevani-emerald',
      action: '#newsletter'
    },
    {
      id: 'podcast',
      title: 'Listen to Podcast',
      subtitle: 'Survivor stories & expert advice',
      icon: Radio,
      color: 'from-sanjeevani-coral to-sanjeevani-rose',
      action: '#podcast'
    },
    {
      id: 'blog',
      title: 'Explore Blog',
      subtitle: 'Community wisdom',
      icon: PenTool,
      color: 'from-sanjeevani-sunshine to-orange-400',
      action: '#blogs'
    },
    {
      id: 'donate',
      title: 'Donate & Empower Healing',
      subtitle: 'Support our mission',
      icon: Heart,
      color: 'from-pink-500 to-red-500',
      action: '#donate'
    }
  ];

  return (
    <section id="cta-section" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-blue-50/50 to-indigo-50/50"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-sanjeevani-blue/10 rounded-full floating-element"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-sanjeevani-coral/10 rounded-full floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-sanjeevani-mint/5 rounded-full floating-element" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Join the Healing Revolution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover resources, connect with our community, and be part of a movement that's transforming cancer survivorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ctaButtons.map((cta, index) => {
            const Icon = cta.icon;
            return (
              <Card
                key={cta.id}
                className="tool-widget p-8 text-center cursor-pointer group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${cta.color} flex items-center justify-center mb-6 floating-element group-hover:animate-pulse-3d`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {cta.title}
                </h3>

                <p className="text-gray-600 mb-6">
                  {cta.subtitle}
                </p>

                <Button 
                  className={`btn-3d bg-gradient-to-r ${cta.color} text-white hover:scale-105 transition-all duration-300 w-full`}
                  onClick={() => {
                    if (cta.id === 'science') {
                      // Scroll to about section which contains our science content
                      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (cta.id === 'newsletter') {
                      // Open email client
                      window.open('mailto:info@sanjeevani.ai?subject=Newsletter Subscription', '_blank');
                    } else if (cta.id === 'podcast') {
                      // Placeholder for future podcast page
                      alert('Podcast coming soon! Stay tuned for survivor stories and expert advice.');
                    } else if (cta.id === 'blog') {
                      // Navigate to community page which serves as our blog
                      navigate('/community');
                    } else if (cta.id === 'donate') {
                      // Placeholder for donation page
                      alert('Donation page coming soon! Thank you for wanting to support our mission.');
                    }
                  }}
                >
                  Get Started
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Main Write-Up Section */}
        <div className="mt-20">
          <Card className="glass-card p-12 rounded-3xl card-3d max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold gradient-text mb-6">
                Welcome to Your Healing Journey
              </h3>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
              <p className="text-xl text-center mb-8">
                At SANJEEVANI AI, we believe that survivorship is not just about getting through cancer—it's about thriving beyond it.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Your Journey Matters</h4>
                  <p>
                    Every survivor's path is unique, filled with triumphs, challenges, and moments of profound growth. Our AI-powered platform honors this uniqueness by providing personalized support that adapts to your specific needs, concerns, and goals.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Community at Heart</h4>
                  <p>
                    Healing happens in connection. Whether you're a survivor, caregiver, or healthcare professional, you'll find a warm, supportive community here where your voice matters and your experience contributes to collective wisdom.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Science-Backed Support</h4>
                  <p>
                    Our tools are grounded in the latest research in oncology, psychology, and survivorship care. We bridge the gap between cutting-edge science and everyday support, making evidence-based care accessible to all.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Privacy First</h4>
                  <p>
                    Your health information is sacred. Our privacy-first approach ensures that your data remains secure while still enabling the personalized, intelligent support you deserve throughout your journey.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8 pt-8 border-t border-gray-200">
                <p className="text-lg font-medium gradient-text mb-6">
                  Ready to transform your survivorship experience? SIA (Scientific & Intelligent Assistant) is waiting to meet you.
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
                  onClick={() => navigate('/auth')}
                >
                  Join Our LARS Community
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
