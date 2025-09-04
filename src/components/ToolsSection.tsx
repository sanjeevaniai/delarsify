
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Bot, Home, Award, Microscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ToolsSection = () => {
  const navigate = useNavigate();
  const tools = [
    {
      id: 'twt',
      title: 'Together We Thrive (TWT)',
      icon: Users,
      description: 'Connect with fellow survivors and caregivers in a safe, supportive community designed for shared healing and growth.',
      features: ['Peer Support Groups', 'Mentorship Programs', 'Success Stories', 'Community Events'],
      color: 'from-sanjeevani-coral to-sanjeevani-rose',
      bgPattern: 'radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)'
    },
    {
      id: 'lars',
      title: 'LARS (Learning & Recovery Support)',
      icon: Bot,
      description: 'Your AI-powered companion providing personalized insights, resources, and guidance tailored to your unique journey.',
      features: ['Personalized Insights', 'Resource Matching', '24/7 Support', 'Progress Tracking'],
      color: 'from-sanjeevani-blue to-sanjeevani-lavender',
      bgPattern: 'radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)'
    },
    {
      id: 'community',
      title: 'Community Hub',
      icon: Home,
      description: 'A vibrant space where survivors, caregivers, and clinicians come together to share knowledge and support.',
      features: ['Discussion Forums', 'Expert Q&A', 'Resource Library', 'Local Meetups'],
      color: 'from-sanjeevani-mint to-sanjeevani-emerald',
      bgPattern: 'radial-gradient(circle at 50% 50%, rgba(78, 205, 196, 0.1) 0%, transparent 50%)'
    },
    {
      id: 'microbiome',
      title: 'Microbiome Analysis',
      icon: Microscope,
      description: 'Advanced gut microbiome analysis based on 16S rRNA sequencing research to identify bacteria patterns associated with LARS symptoms.',
      features: ['Bacteria Analysis', 'Diversity Metrics', 'Enterotype Patterns', 'Personalized Recommendations'],
      color: 'from-primary to-accent',
      bgPattern: 'radial-gradient(circle at 60% 40%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)'
    },
    {
      id: 'membership',
      title: 'Membership Rewards',
      icon: Award,
      description: 'Unlock exclusive benefits, premium features, and special recognition as you engage with our platform.',
      features: ['Premium Content', 'Priority Support', 'Exclusive Events', 'Achievement Badges'],
      color: 'from-sanjeevani-sunshine to-orange-400',
      bgPattern: 'radial-gradient(circle at 70% 30%, rgba(255, 230, 109, 0.1) 0%, transparent 50%)'
    }
  ];

  return (
    <section id="tools" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/30 to-pink-50/30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Our Healing Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our suite of AI-powered tools designed to support every aspect of your survivorship journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                className="tool-widget p-8 overflow-hidden relative"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  background: tool.bgPattern
                }}
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className={`w-full h-full bg-gradient-to-br ${tool.color} rounded-full floating-element`}></div>
                </div>

                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 floating-element`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {tool.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {tool.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${tool.color} mr-2`}></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (tool.id === 'microbiome') {
                        navigate('/lars-manager');
                      } else if (tool.id === 'lars') {
                        navigate('/lars-manager');
                      } else {
                        // Scroll to section or handle other tools
                        const element = document.getElementById(tool.id);
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`btn-3d bg-gradient-to-r ${tool.color} text-white hover:scale-105 transition-all duration-300`}
                  >
                    Explore {tool.title}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
