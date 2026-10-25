import { Link } from "react-router-dom";

const SOCIAL_LINKS = [
  { href: "/", icon: "fa-brands fa-facebook-f", label: "Facebook" },
  { href: "/", icon: "fa-brands fa-instagram", label: "Instagram" },
  { href: "/", icon: "fa-brands fa-youtube", label: "YouTube" },
  { href: "/", icon: "fa-brands fa-linkedin-in", label: "LinkedIn" },
];

const FOOTER_LINKS = [
  { to: "/articles", label: "Blogs" },
  { to: "/docs/privacy_policy", label: "Privacy" },
  { to: "/docs/safety", label: "Safety" },
  { to: "/docs/terms_service", label: "Terms" },
  { to: "/docs/community_guidelines", label: "Guidelines" },
];

export default function Footer() {
  return (
    <footer className="bg-primary py-[22px] px-[35px] pb-4 max-[992px]:py-5 max-[992px]:px-5 max-[992px]:pb-4 max-[576px]:py-[18px] max-[576px]:px-4 max-[576px]:pb-[14px] font-primary">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 max-[576px]:flex-col max-[576px]:gap-3.5">
          <p className="m-0 text-[13px] text-white/65 text-center sm:text-left">
            © 2026 NeedMet. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-2.5">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white/85 bg-white/[0.08] border border-white/10 hover:-translate-y-0.5 hover:bg-white/[0.16] hover:text-white transition-all duration-200 no-underline"
                aria-label={social.label}
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-[18px] max-[992px]:gap-2 max-[576px]:gap-3.5 flex-wrap justify-center">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[13px] text-white/65 hover:text-white transition-colors duration-200 no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
