
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Sparkles } from 'lucide-react';

const SIAMascot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Hi there! I'm SIA, your Scientific & Intelligent Assistant! 🐿️ How can I help you today?",
    "Did you know? Our community has over 10,000 survivors supporting each other! 💪",
    "Feeling overwhelmed? Try our Together We Thrive community - you're never alone! 🤗",
    "New here? Check out our FAQ section for quick answers to common questions! 📚",
    "Remember: Healing isn't linear, and that's perfectly okay. Take it one day at a time! 🌟"
  ];

  const handleMascotClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }
  };

  return (
    <div className="mascot-container">
      {/* Chat Bubble */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 max-w-xs">
          <div className="glass-card p-4 rounded-lg shadow-lg relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 w-6 h-6 p-0 hover:bg-red-100"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="pr-8">
              <p className="text-sm text-gray-700 leading-relaxed">
                {messages[currentMessage]}
              </p>
            </div>
            
            {/* Chat bubble tail */}
            <div className="absolute bottom-0 right-6 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white/80"></div>
            </div>
          </div>
        </div>
      )}

      {/* Mascot Button */}
      <Button
        className="w-16 h-16 rounded-full bg-sanjeevani-blue hover:bg-sanjeevani-blue-dark shadow-lg text-2xl p-0 relative"
        onClick={handleMascotClick}
      >
        
        {/* SIA Mascot Image */}
        <img 
          src="/placeholder.svg"
          alt="SIA - Scientific & Intelligent Assistant"
          className="w-12 h-12 relative z-10 object-contain"
        />
        
        {/* Notification indicator */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <MessageCircle className="w-3 h-3 text-white" />
        </div>
      </Button>

      {/* Floating hint */}
      {!isOpen && (
        <div className="absolute bottom-full right-full mr-4 mb-2 hidden lg:block">
          <div className="bg-sanjeevani-blue text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
            Chat with SIA! 💬
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-sanjeevani-blue"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SIAMascot;
