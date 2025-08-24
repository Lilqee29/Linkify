import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Users, 
  Settings, 
  Link as LinkIcon, 
  Palette, 
  BarChart3, 
  Shield, 
  Mail, 
  Smartphone, 
  Globe,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

const HelpPage = () => {
  const [expandedSections, setExpandedSections] = useState({
    gettingStarted: true,
    features: false,
    customization: false,
    sharing: false,
    troubleshooting: false,
    faq: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const searchHelp = (query) => {
    // Simple search functionality - could be enhanced
    const searchTerm = query.toLowerCase();
    const sections = document.querySelectorAll('[data-help-section]');
    
    sections.forEach(section => {
      const text = section.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-20 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mr-3" />
              <h1 className="text-3xl sm:text-4xl font-bold">Help Center</h1>
            </div>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Everything you need to know about Linkly - your personal link hub
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help topics..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                onChange={(e) => searchHelp(e.target.value)}
              />
            </div>
          </div>

          {/* Help Sections */}
          <div className="space-y-4 sm:space-y-6 px-4">
            
            {/* Getting Started */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('gettingStarted')}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mr-3" />
                  <h2 className="text-lg sm:text-xl font-semibold">Getting Started</h2>
                </div>
                {expandedSections.gettingStarted ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              
              {expandedSections.gettingStarted && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4" data-help-section="getting-started">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-400">1. Create Your Account</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Click "Create an account" in the top right</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Enter your email and create a password</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Check your email for verification link</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Click the verification link to activate your account</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-400">2. Set Up Your Profile</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Upload a profile picture</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Write a bio about yourself</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Choose your theme and colors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Your username is automatically generated from your email</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Important Note</h4>
                        <p className="text-blue-300 text-sm">
                          Email verification is required before you can access your dashboard. 
                          Verification links expire after 2 minutes for security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('features')}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mr-3" />
                  <h2 className="text-lg sm:text-xl font-semibold">Core Features</h2>
                </div>
                {expandedSections.features ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              
              {expandedSections.features && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6" data-help-section="features">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-orange-400">Link Management</h3>
                      <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                        <li>• Add unlimited links to your profile</li>
                        <li>• Organize links into categories (Social, Work, Fun)</li>
                        <li>• Drag and drop to reorder links</li>
                        <li>• Edit link titles and URLs anytime</li>
                        <li>• Delete links you no longer need</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-orange-400">Profile Customization</h3>
                      <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                        <li>• Upload and change profile pictures</li>
                        <li>• Write custom bio text</li>
                        <li>• Choose from preset themes</li>
                        <li>• Customize colors and fonts</li>
                        <li>• Preview changes in real-time</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-orange-400">Sharing & Analytics</h3>
                      <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                        <li>• Get a unique public profile URL</li>
                        <li>• Share your profile link anywhere</li>
                        <li>• Track profile visits and link clicks</li>
                        <li>• View basic analytics in your dashboard</li>
                        <li>• Mobile-responsive design</li>
                        <li>• QR code generation for easy sharing</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-orange-400">Security & Privacy</h3>
                      <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                        <li>• Secure email verification</li>
                        <li>• Password-protected accounts</li>
                        <li>• Google Sign-In option</li>
                        <li>• Private dashboard access</li>
                        <li>• Data encryption</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customization */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('customization')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <Palette className="w-6 h-6 text-orange-500 mr-3" />
                  <h2 className="text-xl font-semibold">Customization Guide</h2>
                </div>
                {expandedSections.customization ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              
              {expandedSections.customization && (
                <div className="px-6 pb-6 space-y-6" data-help-section="customization">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-400">Theme Selection</h3>
                      <p className="text-gray-300 text-sm">
                        Choose from our curated themes or create your own custom color scheme. 
                        Each theme includes carefully selected colors that work well together.
                      </p>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• <strong>Sunset:</strong> Warm orange and pink tones</li>
                        <li>• <strong>Forest:</strong> Natural green and brown hues</li>
                        <li>• <strong>Ocean:</strong> Cool blue and teal shades</li>
                        <li>• <strong>Custom:</strong> Design your own color palette</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-400">Color Customization</h3>
                      <p className="text-gray-300 text-sm">
                        Fine-tune every aspect of your profile appearance with our color picker:
                      </p>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• <strong>Background:</strong> Main page background</li>
                        <li>• <strong>Primary:</strong> Main accent color</li>
                        <li>• <strong>Secondary:</strong> Supporting accent</li>
                        <li>• <strong>Text:</strong> Main text color</li>
                        <li>• <strong>Font:</strong> Typography style</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-start">
                      <Palette className="w-5 h-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-orange-400 mb-2">Pro Tip</h4>
                        <p className="text-orange-300 text-sm">
                          Use contrasting colors for better readability. Light text on dark backgrounds 
                          or dark text on light backgrounds work best for accessibility.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sharing */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('sharing')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-orange-500 mr-3" />
                  <h2 className="text-xl font-semibold">Sharing Your Profile</h2>
                </div>
                {expandedSections.sharing ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              
              {expandedSections.sharing && (
                <div className="px-6 pb-6 space-y-6" data-help-section="sharing">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-400">Your Public URL</h3>
                      <p className="text-gray-300 text-sm">
                        Every user gets a unique public profile URL that looks like:
                      </p>
                      <div className="bg-gray-800 p-3 rounded-lg font-mono text-sm text-green-400">
                        https://yourdomain.com/yourusername
                      </div>
                      <p className="text-gray-300 text-sm mt-2">
                        This URL is automatically generated from your username and can be shared anywhere.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-400">Where to Share</h3>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• <strong>Social Media:</strong> Instagram bio, Twitter bio, TikTok bio</li>
                        <li>• <strong>Professional:</strong> LinkedIn, business cards, email signatures</li>
                        <li>• <strong>Content:</strong> YouTube descriptions, blog posts, presentations</li>
                        <li>• <strong>Direct:</strong> Text messages, emails, QR codes</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-400">Sharing Features</h3>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• <strong>Copy Link:</strong> One-click copy to clipboard</li>
                        <li>• <strong>Native Share:</strong> Use device's share sheet</li>
                        <li>• <strong>QR Code:</strong> Generate QR codes for easy access</li>
                        <li>• <strong>Preview:</strong> See exactly how your profile looks</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-400">Mobile Experience</h3>
                      <p className="text-gray-300 text-sm">
                        Your profile is fully responsive and looks great on all devices:
                      </p>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• Optimized for mobile browsers</li>
                        <li>• Touch-friendly navigation</li>
                        <li>• Fast loading on all networks</li>
                        <li>• Works offline after first visit</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Troubleshooting */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('troubleshooting')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-6 h-6 text-orange-500 mr-3" />
                  <h2 className="text-xl font-semibold">Troubleshooting</h2>
                </div>
                {expandedSections.troubleshooting ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              
              {expandedSections.troubleshooting && (
                <div className="px-6 pb-6 space-y-6" data-help-section="troubleshooting">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-400">Common Issues</h3>
                      <div className="space-y-3">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <h4 className="font-semibold text-red-400 text-sm">Can't Login?</h4>
                          <p className="text-red-300 text-xs">Make sure your email is verified. Check spam folder for verification emails.</p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <h4 className="font-semibold text-yellow-400 text-sm">Profile Not Loading?</h4>
                          <p className="text-yellow-300 text-xs">Check your internet connection and try refreshing the page.</p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <h4 className="font-semibold text-blue-400 text-sm">Changes Not Saving?</h4>
                          <p className="text-blue-300 text-xs">Make sure you're logged in and try refreshing the page.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-400">Quick Fixes</h3>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• <strong>Clear browser cache</strong> if pages aren't updating</li>
                        <li>• <strong>Check internet connection</strong> for loading issues</li>
                        <li>• <strong>Try different browser</strong> if features aren't working</li>
                        <li>• <strong>Log out and back in</strong> for authentication issues</li>
                        <li>• <strong>Check email verification</strong> if login fails</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-300 mb-2">Still Having Issues?</h4>
                    <p className="text-gray-400 text-sm mb-3">
                      If you're still experiencing problems, try these steps:
                    </p>
                    <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
                      <li>Check that you're using a supported browser (Chrome, Firefox, Safari, Edge)</li>
                      <li>Ensure JavaScript is enabled in your browser</li>
                      <li>Try accessing the site from a different device or network</li>
                      <li>Contact support if the issue persists</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('faq')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <HelpCircle className="w-6 h-6 text-orange-500 mr-3" />
                  <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                </div>
                {expandedSections.faq ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              
              {expandedSections.faq && (
                <div className="px-6 pb-6 space-y-4" data-help-section="faq">
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-semibold text-orange-400 mb-2">How do I change my username?</h3>
                      <p className="text-gray-300 text-sm">
                        Usernames are automatically generated from your email address. If you want to change it, 
                        you can do so in your profile settings. The system will check availability to ensure uniqueness.
                      </p>
                    </div>
                    
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-semibold text-orange-400 mb-2">Can I use custom domains?</h3>
                      <p className="text-gray-300 text-sm">
                        Currently, custom domains are not available. You'll get a free profile URL like 
                        "yourdomain.com/yourusername" that you can share anywhere. Custom domains may be 
                        added in future updates.
                      </p>
                    </div>
                    
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-semibold text-orange-400 mb-2">How long do verification links last?</h3>
                      <p className="text-gray-300 text-sm">
                        Email verification links expire after 2 minutes for security. If your link expires, 
                        you can request a new one from the login page.
                      </p>
                    </div>
                    
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-semibold text-orange-400 mb-2">Is my data secure?</h3>
                      <p className="text-gray-300 text-sm">
                        Yes! We use industry-standard encryption and security practices. Your data is stored 
                        securely in Firebase, and we never share your personal information with third parties.
                      </p>
                    </div>
                    
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-semibold text-orange-400 mb-2">Can I export my data?</h3>
                      <p className="text-gray-300 text-sm">
                        Currently, we don't offer data export functionality, but this feature is planned for 
                        future updates. Your data is always accessible through your dashboard.
                      </p>
                    </div>
                    
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-semibold text-orange-400 mb-2">What features are included for free?</h3>
                      <p className="text-gray-300 text-sm">
                        Our free plan includes unlimited links, profile customization, theme selection, 
                        mobile-responsive design, and basic analytics. All core features are completely free!
                      </p>
                    </div>
                    
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-semibold text-orange-400 mb-2">Are there any paid plans?</h3>
                      <p className="text-gray-300 text-sm">
                        Currently, Linkly is completely free with all features included. We're focused on 
                        providing the best free experience possible. Any future premium features will be 
                        announced separately.
                      </p>
                    </div>
                    
                    <div className="pb-4">
                      <h3 className="font-semibold text-orange-400 mb-2">What browsers are supported?</h3>
                      <p className="text-gray-300 text-sm">
                        We support all modern browsers including Chrome, Firefox, Safari, and Edge. 
                        For the best experience, we recommend using the latest version of your browser.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-8 sm:mt-12 text-center px-4">
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                Can't find what you're looking for? Our support team is here to help you get the most out of Linkly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors text-sm sm:text-base">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  Contact Support
                </button>
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border border-white/20 hover:bg-white/10 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpPage;
