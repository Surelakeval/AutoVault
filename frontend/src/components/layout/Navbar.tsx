"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Car, User, Heart, Settings, LogOut } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Browse Cars", path: "/cars" },
  { name: "Sell Car", path: "/sell" },
  { name: "Compare", path: "/compare" },
  { name: "About Us", path: "/about" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <div className="bg-primary p-2 rounded-lg">
              <Car className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Auto<span className="text-primary">Vault</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary relative ${
                  pathname === link.path ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
                {pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/favorites"
              className="p-2 text-foreground/80 hover:text-primary transition-colors"
            >
              <Heart className="w-5 h-5" />
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 bg-input border border-border text-foreground hover:border-primary px-5 py-2 rounded-full transition-all duration-300 font-medium text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-5 py-2 rounded-full transition-all duration-300 font-medium text-sm"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-full transition-all duration-300 font-medium text-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          y: isMobileMenuOpen ? 0 : "-100%",
        }}
        transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 w-full h-screen bg-background border-b border-border md:hidden pt-24 px-6 ${
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6 text-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-medium ${
                pathname === link.path ? "text-primary" : "text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-border my-2" />
          {isLoggedIn ? (
            <div className="flex flex-col gap-4">
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 font-medium text-foreground hover:text-primary"
              >
                <User className="w-5 h-5" /> My Profile
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 font-medium text-foreground hover:text-primary"
              >
                <Settings className="w-5 h-5" /> Admin Dashboard
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="flex items-center gap-3 font-medium text-destructive mt-2"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-primary text-white p-3 rounded-xl font-medium mt-4"
            >
              <User className="w-5 h-5" /> Sign In
            </Link>
          )}
        </div>
      </motion.div>
    </header>
  );
}
