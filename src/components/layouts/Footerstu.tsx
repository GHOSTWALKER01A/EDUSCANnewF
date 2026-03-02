
import React from 'react';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Facebook, Mail, ArrowRight, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)] pt-16 pb-8">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--accent)] blur-[120px] rounded-full opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]">
              <Zap className="h-8 w-8 text-[var(--accent)] animate-pulse" />
              <span className="text-3xl font-extrabold tracking-tight text-white">
                Edu<span className="text-[var(--accent)]">Scan</span>
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
              Empowering the future of education with cutting-edge technology, AI-driven insights, and immersive learning experiences.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon href="#" icon={<Twitter className="w-5 h-5" />} />
              <SocialIcon href="#" icon={<Github className="w-5 h-5" />} />
              <SocialIcon href="#" icon={<Linkedin className="w-5 h-5" />} />
              <SocialIcon href="#" icon={<Facebook className="w-5 h-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Our Courses</FooterLink>
              <FooterLink href="#">Pricing Plans</FooterLink>
              <FooterLink href="#">Latest News</FooterLink>
              <FooterLink href="#">Contact Support</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
              <FooterLink href="#">Community Guidelines</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Stay Updated</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Subscribe to our newsletter for the latest educational insights.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-lg"
                />
              </div>
              <button 
                type="submit" 
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[#020617] font-semibold transition-all shadow-[var(--glow)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-color)] border-opacity-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-secondary)] text-sm text-center md:text-left">
            © {new Date().getFullYear()} EduScan. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span>Built with</span>
            <span className="text-[var(--accent)] animate-pulse">❤</span>
            <span>for students worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-block hover:translate-x-1 transform duration-200 text-sm"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:shadow-[var(--glow)] hover:-translate-y-1 transition-all duration-300 pointer-events-auto"
    >
      {icon}
    </a>
  );
}
