
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FoundersStory = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-sanjeevani-blue mb-6">
              The Founder's Story
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the journey that led to the creation of SANJEEVANI AI
            </p>
          </div>

          <div className="glass-card rounded-lg p-8 md:p-12 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Founder Image */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="w-full max-w-md mx-auto lg:mx-0">
                    <img
                      src="/sia-avatar.png"
                      alt="Founder of DeLARSify"
                      className="w-full h-auto rounded-lg shadow-lg object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <div className="order-1 lg:order-2">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    The story of SANJEEVANI AI begins with a deeply personal journey through the complex world of cancer care. Our founder experienced firsthand the challenges that patients, survivors, and caregivers face when navigating the overwhelming landscape of cancer treatment and recovery.
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    During this journey, it became clear that while medical advances have improved treatment outcomes, the emotional, psychological, and informational support systems for cancer patients remained fragmented and difficult to access.
                  </p>

                  <blockquote className="border-l-4 border-sanjeevani-blue pl-6 italic text-gray-600 my-8">
                    "The vision for SANJEEVANI AI was born from this realization – to create an intelligent, compassionate platform that could bridge these gaps."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Named after the mythical healing herb "Sanjeevani" from ancient Indian texts, our platform represents the fusion of traditional wisdom with cutting-edge artificial intelligence. The goal was simple yet ambitious: to create a comprehensive ecosystem that empowers every individual touched by cancer with the tools, knowledge, and community they need to thrive.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Today, SANJEEVANI AI stands as a testament to the power of turning personal challenges into solutions that can help countless others. Our journey continues as we work tirelessly to expand our platform's capabilities and reach more people who can benefit from our AI-powered support system.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FoundersStory;
