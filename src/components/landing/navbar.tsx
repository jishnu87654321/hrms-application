import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Menu, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Analytics", href: "#analytics" },
  { name: "How It Works", href: "#workflow" },
  { name: "Benefits", href: "#benefits" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0c0a1d]/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <a href="#" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-lg font-bold text-white">HRMS</span>
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                  {link.name}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login">
                <button className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/login">
                <button className="px-4 py-2 text-sm bg-white text-[#0c0a1d] rounded-md font-medium hover:bg-white/90 transition-colors flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0c0a1d] pt-20 lg:hidden"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-white hover:text-indigo-400 transition-colors">
                    {link.name}
                  </a>
                ))}
                <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-2 border border-white/20 text-white rounded-md hover:bg-white/10 transition-colors">Login</button>
                  </Link>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-2 bg-white text-[#0c0a1d] rounded-md font-medium hover:bg-white/90 transition-colors">Get Started</button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
