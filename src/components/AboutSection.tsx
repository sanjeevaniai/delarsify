
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Heart, Target, Eye, Users } from 'lucide-react';

const AboutSection = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const aboutCards = [
    {
      id: 'story',
      title: 'Our Story',
      icon: Heart,
      content: 'Born from the lived experiences of survivors and caregivers, SANJEEVANI AI bridges the gap between clinical care and emotional support. Our multidisciplinary team of oncologists, data scientists, and survivors created this platform to ensure no one faces cancer survivorship alone.',
      color: 'from-sanjeevani-coral to-sanjeevani-rose'
    },
    {
      id: 'mission',
      title: 'Mission',
      icon: Target,
      content: 'To democratize access to personalized survivorship support through AI-powered tools that respect privacy, embrace diversity, and empower every individual touched by cancer to thrive beyond treatment.',
      color: 'from-sanjeevani-blue to-sanjeevani-lavender'
    },
    {
      id: 'vision',
      title: 'Vision',
      icon: Eye,
      content: 'A world where cancer survivorship is not just about surviving, but about thriving with confidence, community, and cutting-edge support that adapts to each unique journey.',
      color: 'from-sanjeevani-mint to-sanjeevani-emerald'
    },
    {
      id: 'team',
      title: 'Team',
      icon: Users,
      content: 'Our diverse team includes cancer survivors, caregivers, oncologists, AI researchers, and mental health professionals. Together, we bring both scientific rigor and deep empathy to everything we build.',
      color: 'from-sanjeevani-sunshine to-orange-400'
    }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-primary/5 to-accent/5"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            About SANJEEVANI AI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're more than technology—we're a community united by science, compassion, and the belief that every survivor deserves personalized support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className={`tool-widget p-6 cursor-pointer transition-all duration-500 ${activeCard === card.id ? 'scale-105' : 'hover:scale-105'
                  }`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setActiveCard(card.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 mx-auto floating-element`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
                  {card.title}
                </h3>

                <p className="text-gray-600 text-center leading-relaxed">
                  {card.content}
                </p>

                {activeCard === card.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <span className="text-sm text-sanjeevani-blue font-medium">
                        Learn More →
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Team Intro */}
        <div className="mt-20 text-center">
          <div className="glass-card p-8 rounded-3xl max-w-4xl mx-auto card-3d">
            <h3 className="text-2xl font-bold gradient-text mb-4">
              Meet Our Multidisciplinary Team
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our team brings together the best of medical expertise, technological innovation, and lived experience. From board-certified oncologists to AI researchers, from cancer survivors to mental health professionals—we're united by a shared commitment to transforming survivorship care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
