
import React from 'react';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Facebook, Mail, ArrowRight, Zap } from 'lucide-react';

export default function Footer() {
  return (
   <footer className="relative mt-20 overflow-hidden bg-[var(--bg-primary)] pt-20 pb-8 border-t border-[var(--border-color)]">
      
      {/* --- BACKGROUND EFFECTS --- */}
      {/* Animated Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-80 animate-[slide_3s_ease-in-out_infinite_alternate]"></div>
      
      {/* Ambient Glows */}
      <div className="absolute top-[-200px] left-1/4 w-[600px] h-[400px] bg-[var(--accent)] blur-[150px] rounded-full opacity-10 pointer-events-none animate-[pulse_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-100px] right-0 w-[400px] h-[400px] bg-purple-900 blur-[150px] rounded-full opacity-10 pointer-events-none"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02MCAwaS02MHY2MGg2MFYweiIgc3Ryb2tlPSJyZ2JhKDE5NCwgMTg0LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] pointer-events-none [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]"></div>

      {/* --- CENTERED BACKGROUND WATERMARK --- */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.05] md:opacity-[0.08]">
        {/* Replace the src path with your exact image path if it's different in your project */}
        <img 
          src="/download.png" 
          alt="Brand Watermark" 
          className="w-[300px] sm:w-[450px] md:w-[600px] object-contain drop-shadow-2xl"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Adjusted Grid Layout: Now a perfectly balanced 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* BRAND & DESCRIPTION (Spans 2 columns on large screens to balance the layout) */}
          <div className="space-y-6 lg:col-span-2 lg:pr-12">
            {/* Replace <a> with Next.js <Link href="/"> */}
            <Link href="/" className="group inline-flex items-center gap-3 drop-shadow-[0_0_15px_rgba(194,184,255,0.2)]">
              {/* EduScan Custom SVG Logo */}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--accent)]/30 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent)] shadow-[0_0_12px_2px_var(--accent)] opacity-80 animate-[scan_3s_ease-in-out_infinite]" />
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--accent)] group-hover:scale-110 transition-transform duration-500">
                  <path d="M4 8V6C4 4.89543 4.89543 4 6 4H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M4 16V18C4 19.1046 4.89543 20 6 20H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M20 8V6C20 4.89543 19.1046 4 18 4H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M20 16V18C20 19.1046 19.1046 20 18 20H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 16C12 16 9.5 14.5 7 14.5V7.5C9.5 7.5 12 8 12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M12 16C12 16 14.5 14.5 17 14.5V7.5C14.5 7.5 12 8 12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-3xl font-extrabold tracking-tight">
                <span className="text-white">Edu</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)]">Scan</span>
              </span>
            </Link>
            
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm">
              Empowering the future of education with cutting-edge technology, AI-driven insights, and highly immersive learning experiences.
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              <SocialIcon href="#" icon={<Twitter className="w-4 h-4" />} />
              <SocialIcon href="#" icon={<Github className="w-4 h-4" />} />
              <SocialIcon href="#" icon={<Linkedin className="w-4 h-4" />} />
              <SocialIcon href="#" icon={<Facebook className="w-4 h-4" />} />
            </div>
          </div>

          {/* QUICK LINKS (Spans 1 column) */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-[var(--accent)] rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Our Courses</FooterLink>
              <FooterLink href="#">Pricing Plans</FooterLink>
              <FooterLink href="#">Latest News</FooterLink>
              <FooterLink href="#">Contact Support</FooterLink>
            </ul>
          </div>

          {/* LEGAL (Spans 1 column) */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Legal
              <span className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-[var(--accent)] rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
              <FooterLink href="#">Community Guidelines</FooterLink>
            </ul>
          </div>
          
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-secondary)] text-sm text-center md:text-left">
            © {new Date().getFullYear()} EduScan. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--card-bg)] px-4 py-2 rounded-full border border-[var(--border-color)]">
            <span>Built with</span>
            <span className="text-red-500 animate-[pulse_1s_ease-in-out_infinite]">❤</span>
            <span>for students worldwide</span>
          </div>
        </div>
      </div>

      {/* Global CSS Animations */}
      <style>{`
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        
      `}</style>
    </footer>
  );
}

// Custom Footer Link Component with advanced hover state
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      {/* Replace <a> with Next.js <Link> */}
      <a 
        href={href} 
        className="group flex items-center text-[var(--text-secondary)] hover:text-white transition-colors duration-300 text-sm w-fit"
      >
        <span className="w-0 h-[2px] bg-[var(--accent)] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out rounded-full"></span>
        <span className="group-hover:translate-x-1 transition-transform duration-300 ease-out">
          {children}
        </span>
      </a>
    </li>
  );
}

// Custom Social Icon Component with premium inverted hover state
function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] overflow-hidden group transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(194,184,255,0.2)]"
    >
      {/* Background fill on hover */}
      <span className="absolute inset-0 bg-[var(--accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
      {/* Icon */}
      <span className="relative z-10 group-hover:text-[#0b0714] transition-colors duration-300">
        {icon}
      </span>
    </Link>
  );
}
