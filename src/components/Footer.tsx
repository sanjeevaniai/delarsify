
import { Heart, Mail, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Together We Thrive', href: '#twt' },
        { name: 'LARS AI', href: '#lars' },
        { name: 'Community', href: 'https://www.skool.com/lets-delarsify/about?ref=31e315a378cf46bc851bf447eb51d738', external: true },
        { name: 'Membership', href: '#membership' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Publications', href: '#publications' },
        { name: 'Podcast', href: '#podcast' },
        { name: 'Newsletter', href: '#newsletter' },
        { name: 'Blog', href: '#blogs' }
      ]
    },
    {
      title: 'About',
      links: [
        { name: 'Our Story', href: '#story' },
        { name: 'Mission & Vision', href: '#mission' },
        { name: 'Team', href: '#team' },
        { name: 'Careers', href: '#careers' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#help' },
        { name: 'Contact Us', href: '#contact' },
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Terms of Service', href: '#terms' }
      ]
    }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sanjeevani-blue/10 rounded-full floating-element"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-sanjeevani-coral/10 rounded-full floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-sanjeevani-mint/5 rounded-full floating-element" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img
                src="/favicon.png"
                alt="DeLARSify Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Three-agent AI architecture addressing LARS at multiple stages of care with continuous knowledge, predictive decision support, and personalized management.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sanjeevani-blue transition-all duration-300 card-3d">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sanjeevani-coral transition-all duration-300 card-3d">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sanjeevani-mint transition-all duration-300 card-3d">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-white">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm hover:underline flex items-center gap-1"
                    >
                      {link.name}
                      {link.external && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>© {currentYear} DeLARSify. All rights reserved.</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-gray-300 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-300 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#accessibility" className="text-gray-300 hover:text-white transition-colors duration-300">
                Accessibility
              </a>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Made with love for the cancer survivorship community.
              <span className="ml-1 gradient-text bg-gradient-to-r from-sanjeevani-coral to-sanjeevani-mint bg-clip-text text-transparent">
                Together, we heal stronger.
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
