import Link from "next/link";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-2 rounded-lg">
                <Car className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Auto<span className="text-primary">Vault</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Premium second-hand cars with 100% verified quality, doorstep delivery, and easy financing options. Drive your dream car today.
            </p>
            <div className="flex gap-4 text-sm font-bold text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">FB</a>
              <a href="#" className="hover:text-primary transition-colors">TW</a>
              <a href="#" className="hover:text-primary transition-colors">IG</a>
              <a href="#" className="hover:text-primary transition-colors">IN</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/cars" className="text-muted-foreground hover:text-primary transition-colors">Browse Cars</Link></li>
              <li><Link href="/sell" className="text-muted-foreground hover:text-primary transition-colors">Sell Your Car</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Top Brands */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Top Brands</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/cars?brand=BMW" className="text-muted-foreground hover:text-primary transition-colors">BMW Used Cars</Link></li>
              <li><Link href="/cars?brand=Audi" className="text-muted-foreground hover:text-primary transition-colors">Audi Used Cars</Link></li>
              <li><Link href="/cars?brand=Mercedes" className="text-muted-foreground hover:text-primary transition-colors">Mercedes Used Cars</Link></li>
              <li><Link href="/cars?brand=Hyundai" className="text-muted-foreground hover:text-primary transition-colors">Hyundai Used Cars</Link></li>
              <li><Link href="/cars?brand=Maruti" className="text-muted-foreground hover:text-primary transition-colors">Maruti Used Cars</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">123 Auto Hub Drive, Motor City, Ahmedabad 380015</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">hello@autovault.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AutoVault. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
