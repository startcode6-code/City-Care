import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Logo } from "./logo";
import { departments } from "@/lib/data";
import { nav, site } from "@/lib/site";

const linkClass = "underline-offset-4 hover:text-foreground hover:underline";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Specialist care, modern diagnostics and an emergency team that never closes.
          </p>
        </div>

        <FooterColumn title="Quick links">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Departments">
          {departments.map((d) => (
            <li key={d.slug}>
              <Link href={`/departments#${d.slug}`} className={linkClass}>
                {d.name}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <div>
          <h3 className="text-sm font-bold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {site.address}
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <a href={site.phoneHref} className={linkClass}>
                {site.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <a href={`mailto:${site.email}`} className={linkClass}>
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t">
        <Container className="flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>In an emergency, call {site.phone} or visit the Emergency Wing.</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">{children}</ul>
    </div>
  );
}
