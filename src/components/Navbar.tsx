"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/coaching", label: "Work With Me" },
  { href: "/peptalk", label: "Free Pep-Talk" },
  { href: "/content", label: "Content" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1227]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          PROTOCOLS BY JAMES
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://app.protocolsbyjames.com"
            className="text-sm bg-amber-400 text-black px-4 py-2 rounded-md font-medium hover:bg-amber-500 transition-colors"
          >
            App
          </a>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0b1227]/95 border-t border-white/10 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://app.protocolsbyjames.com"
            className="block bg-amber-400 text-black px-4 py-2 rounded-md font-medium text-center hover:bg-amber-500 transition-colors"
          >
            App
          </a>
        </div>
      )}
    </nav>
  );
}
