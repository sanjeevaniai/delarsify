
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToSIA = () => {
    const siaElement = document.getElementById('lars-ama') || document.querySelector('[data-chat-interface]');
    if (siaElement) {
      siaElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll to the section that contains the chat
      const chatSection = document.querySelector('section');
      chatSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-primary mb-4">The DeLARSify System</span>
            <span className="block text-gray-800">Three-Agent AI Architecture</span>
            <span className="block text-gray-600 text-3xl md:text-5xl lg:text-6xl mt-4">
              For <span className="text-accent">LARS Management</span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            <span className="font-semibold text-primary">DeLARSify</span> uses a three-agent AI architecture to address LARS at multiple stages of care with continuous knowledge, predictive decision support, and personalized management.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-medium"
          >
            Join DeLARSify
          </Button>
          <Button
            onClick={scrollToSIA}
            variant="outline"
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-medium"
          >
            Learn More
          </Button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
