
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, Users, Target, Lightbulb } from 'lucide-react';

const WhoAreWe = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description: "Every feature we build is designed with empathy and understanding for the cancer journey."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "We believe in the power of connection and shared experiences in the healing process."
    },
    {
      icon: Target,
      title: "Purpose Focused",
      description: "Our mission is clear: to improve lives through intelligent, accessible cancer support."
    },
    {
      icon: Lightbulb,
      title: "Innovation Minded",
      description: "We harness cutting-edge AI technology to create meaningful solutions for real problems."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Who Are We
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A dedicated team united by the mission to transform cancer care through AI-powered support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                SANJEEVANI AI exists to democratize access to comprehensive cancer support. We combine artificial intelligence with human compassion to create tools that empower patients, survivors, caregivers, and healthcare professionals throughout the cancer journey.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We envision a world where no one faces cancer alone – where intelligent technology amplifies human support, where information is accessible, and where every individual has the resources they need to not just survive, but thrive.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center gradient-text mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="glass-card rounded-xl p-6 text-center card-3d">
                  <div className="w-16 h-16 bg-sanjeevani-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-sanjeevani-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold gradient-text mb-6">Our Commitment</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              We are committed to continuous innovation, ethical AI practices, and maintaining the highest standards of privacy and security. Our team consists of healthcare professionals, AI researchers, cancer survivors, and passionate advocates who understand that behind every data point is a human story that deserves our utmost care and attention.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WhoAreWe;
