import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const productLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "AI Technology", href: "#ai-tech" },
    { name: "Zen Garden", href: "#zen-garden" }
  ];

  const supportLinks = [
    { name: "Help Center", href: "#help" },
    { name: "Contact Us", href: "#contact" },
    { name: "Community", href: "#community" },
    { name: "Status", href: "#status" }
  ];

  const companyLinks = [
    { name: "About Us", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Press", href: "#press" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "GDPR", href: "#gdpr" }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#facebook" },
    { icon: <Twitter className="w-5 h-5" />, href: "#twitter" },
    { icon: <Instagram className="w-5 h-5" />, href: "#instagram" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#linkedin" }
  ];

  return (
    <footer className="bg-stone-800 text-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Newsletter Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/zenilience_z_logo_2-removebg-preview.png" 
                alt="Zenilience Logo" 
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold">Zenilience</span>
            </div>
            <p className="text-stone-200 mb-6 max-w-md">
              Empowering mental wellness through personalized AI-driven guidance. Build resilience, reduce stress, and achieve lasting well-being.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Stay Updated on Your Wellness Journey</h3>
              <p className="text-stone-200 mb-4">
                Get weekly insights, new features, and exclusive wellness tips delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 text-white placeholder-stone-300 focus:outline-none focus:border-stone-500"
                />
                <button className="bg-stone-600 text-white px-6 py-2 rounded-lg hover:bg-stone-500 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-stone-300 mt-2">
                GDPR compliant. Unsubscribe anytime.
              </p>
            </div>

            {/* App Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-stone-700 rounded-lg px-4 py-2 flex items-center space-x-3 hover:bg-stone-600 transition-colors cursor-pointer">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="text-xs text-stone-300">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </div>
              <div className="bg-stone-700 rounded-lg px-4 py-2 flex items-center space-x-3 hover:bg-stone-600 transition-colors cursor-pointer">
                <div className="text-2xl">🤖</div>
                <div>
                  <div className="text-xs text-stone-300">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {productLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-stone-200 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-stone-200 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-stone-200 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-stone-200 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-stone-700 pt-8 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-stone-400" />
              <div>
                <div className="text-stone-300 text-sm">Email</div>
                <div>help@zenilience.site</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-stone-400" />
              <div>
                <div className="text-stone-300 text-sm">Support</div>
                <div>+1 284 399299</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-stone-400" />
              <div>
                <div className="text-stone-300 text-sm">Address</div>
                <div>San Francisco, CA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-stone-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-stone-300 mb-4 md:mb-0">
            © 2025 Zenilience. All rights reserved.
          </div>
          
          {/* Social Media Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="bg-stone-700 p-2 rounded-lg text-stone-200 hover:bg-stone-600 hover:text-white transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;