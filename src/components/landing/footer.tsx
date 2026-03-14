import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

const links = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Analytics", href: "#analytics" },
    { name: "Workflow", href: "#workflow" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
  ],
  resources: [
    { name: "Documentation", href: "#docs" },
    { name: "Dashboard", to: "/login" },
    { name: "Login", to: "/login" },
  ],
};

export function Footer() {
  return (
    <footer className="py-16 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-xl font-bold text-white">HRMS</span>
            </div>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              The intelligent Human Resource Management System for modern organizations.
              Manage, analyze, and grow your workforce.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  {'to' in link && link.to ? (
                    <Link to={link.to} className="text-sm text-white/50 hover:text-white transition-colors">{link.name}</Link>
                  ) : (
                    <a href={'href' in link ? link.href : '#'} className="text-sm text-white/50 hover:text-white transition-colors">{link.name}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">&copy; {new Date().getFullYear()} HRMS. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Version 1.0.0</span>
            <span className="text-white/30">•</span>
            <a href="#privacy" className="text-xs text-white/50 hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-white/30">•</span>
            <a href="#terms" className="text-xs text-white/50 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
