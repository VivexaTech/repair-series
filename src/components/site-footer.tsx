import Link from "next/link";
import { Container } from "@/components/container";
import { Wrench, Phone, Mail } from "lucide-react";

// Inline SVG for the Instagram icon
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Inline SVG for the Google Play Store icon
function PlayStoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#0a0f1c] pt-16 pb-8 text-white">
      <Container>
        <div className="mb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-6 pr-0 lg:pr-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white transition-transform hover:scale-[1.02]"
            >
              <Wrench className="size-7 text-[#f96316]" />
              <span>Repair Series</span>
            </Link>
            <p className="text-[0.95rem] leading-relaxed text-[#94a3b8]">
              Gurugram's most trusted doorstep appliance repair platform. We bring transparency, standard pricing, and expert technicians directly to your home.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/repairseries/"
                target="_blank"
                rel="noreferrer"
                className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#f96316] hover:bg-[#f96316] hover:shadow-[0_5px_15px_rgba(249,99,22,0.4)]"
                aria-label="Visit Our Instagram Page"
              >
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h5 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h5>
            <ul className="space-y-3.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Partner with Us", href: "/partner" },
                { label: "Tech Blog", href: "/blog" },
                { label: "Contact Support", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block text-[0.95rem] text-[#94a3b8] transition-all duration-300 hover:translate-x-1.5 hover:text-[#f96316]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h5 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Our Services
            </h5>
            <ul className="space-y-3.5">
              {[
                { label: "AC Repair & Service", href: "/services/ac-repair" },
                { label: "Washing Machine Repair", href: "/services/washing-machine" },
                { label: "Refrigerator Repair", href: "/services/refrigerator" },
                { label: "Microwave Repair", href: "/services/microwave" },
                { label: "RO Water Purifier", href: "/services/ro-repair" },
                { label: "Chimney Repair", href: "/services/chimney" },
                { label: "Gas Stove Repair", href: "/services/gas-stove" },
                { label: "Hob Repair", href: "/services/hob" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block text-[0.95rem] text-[#94a3b8] transition-all duration-300 hover:translate-x-1.5 hover:text-[#f96316]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & App Download */}
          <div>
            <h5 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h5>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-[0.95rem]">
                <Phone className="size-5 shrink-0 text-[#f96316]" />
                <a
                  href="tel:+918796299677"
                  className="text-[#94a3b8] transition-colors hover:text-[#f96316]"
                >
                  +91 87962 99677
                </a>
              </li>
              <li className="flex items-center gap-3 text-[0.95rem]">
                <Mail className="size-5 shrink-0 text-[#f96316]" />
                <a
                  href="mailto:support@repairseries.com"
                  className="text-[#94a3b8] transition-colors hover:text-[#f96316]"
                >
                  support@repairseries.com
                </a>
              </li>
            </ul>

            {/* Install App Section */}
            <h5 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Get the App
            </h5>
            <a
              href="https://play.google.com/store/apps/details?id=com.repairseries.user&pcampaignid=web_share"
              className="group inline-flex h-14 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#f96316]/50 hover:bg-white/10 hover:shadow-[0_5px_15px_rgba(249,99,22,0.15)]"
            >
              <PlayStoreIcon className="size-7 text-white transition-colors group-hover:text-[#f96316]" />
              <div className="flex flex-col items-start justify-center">
                <span className="text-[10px] font-medium leading-tight text-[#94a3b8]">
                  GET IT ON
                </span>
                <span className="text-sm font-bold leading-tight text-white">
                  Google Play
                </span>
              </div>
            </a>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[0.85rem] text-[#94a3b8] md:flex-row">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Repair Series. All Rights Reserved. Powered by{" "}
            <a
              href="https://www.vivexatech.in/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#cbd5e1] transition-colors hover:text-white"
            >
              Vivexa Tech
            </a>
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/privacy-policy" className="transition-colors hover:text-[#f96316]">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="transition-colors hover:text-[#f96316]">
              Terms of Service
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/refund" className="transition-colors hover:text-[#f96316]">
              Refund Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}