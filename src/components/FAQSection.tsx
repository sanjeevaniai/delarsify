
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: 'What is SANJEEVANI AI and how can it help me?',
      answer: 'SANJEEVANI AI is an intelligent, privacy-first platform designed to support cancer survivors, caregivers, and healthcare professionals. Our AI companion SIA (Scientific & Intelligent Assistant) provides personalized insights, connects you with relevant resources, and helps you navigate your survivorship journey with confidence and community support.'
    },
    {
      id: 2,
      question: 'Is my health information secure and private?',
      answer: 'Absolutely. Privacy is at the core of everything we do. We use enterprise-grade encryption, follow HIPAA compliance standards, and never share your personal health information without your explicit consent. Your data is used only to provide you with personalized support and remains completely confidential.'
    },
    {
      id: 3,
      question: 'How does the AI personalization work?',
      answer: 'Our AI learns from your preferences, concerns, and goals to provide tailored recommendations. It considers factors like your type of cancer, treatment history, current concerns, and personal interests to suggest relevant resources, connect you with similar survivors, and offer insights that matter most to your unique journey.'
    },
    {
      id: 4,
      question: 'Can caregivers and family members use the platform?',
      answer: 'Yes! SANJEEVANI AI is designed for the entire care ecosystem. Caregivers, family members, and friends can create their own profiles to access resources specifically designed for their needs, connect with other caregivers, and better support their loved ones.'
    },
    {
      id: 5,
      question: 'What types of cancer survivors can benefit from this platform?',
      answer: 'Our platform is designed to support survivors of all cancer types, at any stage of their journey. Whether you\'re newly diagnosed, in treatment, in remission, or years into survivorship, SANJEEVANI AI adapts to provide relevant support for your current needs.'
    },
    {
      id: 6,
      question: 'How much does it cost to use SANJEEVANI AI?',
      answer: 'We offer both free and premium membership options. Our core features, including community access and basic AI support, are available at no cost. Premium memberships unlock additional features like priority support, exclusive content, and advanced personalization tools.'
    },
    {
      id: 7,
      question: 'Can healthcare professionals use this platform?',
      answer: 'Yes! We welcome healthcare professionals who want to better understand the survivorship experience, access latest research, and connect with the community they serve. We also offer tools for professionals to refer patients and stay updated on survivorship best practices.'
    },
    {
      id: 8,
      question: 'How do I get started with SANJEEVANI AI?',
      answer: 'Getting started is simple! Click on "Meet SIA" to begin your journey. You\'ll complete a brief, secure onboarding process that helps us understand your needs and preferences. From there, SIA will guide you through the platform and help you discover the most relevant features for your journey.'
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/60 via-blue-50/40 to-primary/5"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Find answers to common questions about SANJEEVANI AI and how we can support your journey.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card
              key={faq.id}
              className="glass-card overflow-hidden card-3d"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Button
                variant="ghost"
                className="w-full p-6 text-left justify-between hover:bg-white/50 transition-all duration-300"
                onClick={() => toggleFAQ(faq.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sanjeevani-blue to-sanjeevani-coral flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">{faq.id}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 text-left">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {openFAQ === faq.id ? (
                    <ChevronUp className="w-6 h-6 text-sanjeevani-blue" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </Button>

              {openFAQ === faq.id && (
                <div className="px-6 pb-6 animate-card-enter">
                  <div className="ml-12 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <Card className="glass-card p-8 card-3d">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="w-12 h-12 text-sanjeevani-blue" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Don't see your question?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help! Reach out to us and we'll get back to you within 24 hours.
            </p>
            <Button
              size="lg"
              className="btn-3d bg-gradient-to-r from-sanjeevani-blue to-sanjeevani-lavender text-white hover:scale-105 transition-all duration-300 px-8 py-3"
            >
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
