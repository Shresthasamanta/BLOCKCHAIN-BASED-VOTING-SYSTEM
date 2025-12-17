import { Vote, Shield, Lock, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Vote className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">BlockVote</span>
            </div>
            <p className="text-secondary-foreground/70 max-w-sm">
              Secure, transparent, and verifiable blockchain voting for modern organizations.
              Every vote counts, every vote is protected.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/60">
                <Shield className="h-4 w-4" />
                End-to-End Encrypted
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/60">
                <Lock className="h-4 w-4" />
                Tamper-Proof
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-secondary-foreground/70">
              <li><Link to="/elections" className="hover:text-secondary-foreground transition-colors">Elections</Link></li>
              <li><Link to="/results" className="hover:text-secondary-foreground transition-colors">Results</Link></li>
              <li><Link to="/verify" className="hover:text-secondary-foreground transition-colors">Verify Vote</Link></li>
              <li><Link to="/how-it-works" className="hover:text-secondary-foreground transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-secondary-foreground/70">
              <li><a href="#" className="hover:text-secondary-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-foreground/60">
            © 2024 BlockVote. All rights reserved. Demo purposes only.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
