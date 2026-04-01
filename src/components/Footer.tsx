import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-3">JAMES</h3>
            <p className="text-gray-400 text-sm max-w-md">
              Physique & self-optimization coaching. Build your best self through
              training, nutrition, and personalized protocols.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Pages</h4>
            <div className="space-y-2">
              <Link href="/coaching" className="block text-sm text-gray-400 hover:text-white transition-colors">Work With Me</Link>
              <Link href="/content" className="block text-sm text-gray-400 hover:text-white transition-colors">Content</Link>
              <Link href="/about" className="block text-sm text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="block text-sm text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Connect</h4>
            <div className="space-y-2">
              <a href="https://app.protocolsbyjames.com" className="block text-sm text-gray-400 hover:text-white transition-colors">Client Dashboard</a>
              <a href="https://instagram.com" className="block text-sm text-gray-400 hover:text-white transition-colors">Instagram</a>
              <a href="https://youtube.com" className="block text-sm text-gray-400 hover:text-white transition-colors">YouTube</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} James. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
