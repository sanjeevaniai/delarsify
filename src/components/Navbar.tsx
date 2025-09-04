
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const navigationItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    {
      name: 'LARS',
      href: '#lars',
      dropdown: [
        { name: 'LARS AMA', href: '/lars-ama' },
        { name: 'LLP', href: '/llp' },
        { name: 'LARS Manager', href: '/lars-manager' }
      ]
    },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Community', href: 'https://www.skool.com/lets-delarsify/about?ref=31e315a378cf46bc851bf447eb51d738', external: true }
  ];

  const handleDropdownToggle = (itemName: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'navbar-blur py-2' : 'bg-transparent py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/favicon.png"
                alt="DeLARSify Logo"
                className="w-16 h-16 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative" data-dropdown>
                {item.dropdown ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => handleDropdownToggle(item.name, e)}
                      className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-sanjeevani-blue transition-all duration-300 flex items-center gap-1 hover:bg-white/50 cursor-pointer"
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>

                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-[60] border animate-card-enter">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            onClick={closeDropdown}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-sanjeevani-blue/10 hover:text-sanjeevani-blue transition-colors duration-200"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (item.href.startsWith('#')) {
                        const targetId = item.href.substring(1);
                        const element = document.getElementById(targetId);
                        element?.scrollIntoView({ behavior: 'smooth' });
                      } else if (item.href.startsWith('/')) {
                        navigate(item.href);
                      } else if (item.external) {
                        window.open(item.href, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary transition-all duration-300 flex items-center gap-1 hover:bg-white/50"
                  >
                    {item.name}
                    {item.external && (
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            ))}

            {/* Auth Section */}
            <div className="ml-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.email}</span>
                  </div>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="card-3d"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 glass-card rounded-xl p-4 animate-card-enter">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-white/50 transition-all duration-300 flex items-center gap-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                    {item.external && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </a>
                  {item.dropdown && (
                    <div className="ml-4 space-y-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          className="block px-3 py-2 text-xs text-gray-600 hover:text-sanjeevani-blue transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2">
                      <User className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <Button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setIsOpen(false);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
