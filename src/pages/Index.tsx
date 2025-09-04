
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MainTabs from '@/components/MainTabs';
import ToolsSection from '@/components/ToolsSection';
import TestimonialSection from '@/components/TestimonialSection';
import CTASection from '@/components/CTASection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MainTabs />
      <ToolsSection />
      <TestimonialSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
