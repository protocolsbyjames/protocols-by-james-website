import Link from "next/link";

// lucide-react doesn't ship Instagram or TikTok marks, so inline the SVGs.
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1Z" />
    </svg>
  );
}

const socials = [
  {
    href: "https://instagram.com/protocolsbyjames",
    label: "Instagram",
    icon: <InstagramIcon size={18} />,
  },
  {
    href: "https://tiktok.com/@protocolsbyjames",
    label: "TikTok",
    icon: <TikTokIcon size={18} />,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b1227]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-3">PROTOCOLS BY JAMES</h3>
            <p className="text-gray-400 text-sm max-w-md mb-4">
              Physique & self-optimization coaching. Build your best self through
              training, nutrition, and personalized protocols.
            </p>
            <a
              href="mailto:protocolsbyjames@gmail.com"
              className="block text-sm text-gray-400 hover:text-white transition-colors mb-5"
            >
              protocolsbyjames@gmail.com
            </a>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 text-gray-300 hover:text-black hover:bg-amber-400 hover:border-amber-400 transition-colors flex items-center justify-center"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Pages</h4>
            <div className="space-y-2">
              <Link href="/coaching" className="block text-sm text-gray-400 hover:text-white transition-colors">Work With Me</Link>
              <Link href="/peptalk" className="block text-sm text-gray-400 hover:text-white transition-colors">Free Peptalk</Link>
              <Link href="/content" className="block text-sm text-gray-400 hover:text-white transition-colors">Content</Link>
              <Link href="/about" className="block text-sm text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="block text-sm text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Connect</h4>
            <div className="space-y-2">
              <a
                href="https://app.protocolsbyjames.com"
                className="block text-sm text-gray-400 hover:text-white transition-colors"
              >
                Client Dashboard
              </a>
              <a
                href="https://instagram.com/protocolsbyjames"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com/@protocolsbyjames"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 hover:text-white transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Legal</h4>
            <div className="space-y-2">
              <Link href="/terms" className="block text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="block text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/refund-policy" className="block text-sm text-gray-400 hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Protocols by James. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
