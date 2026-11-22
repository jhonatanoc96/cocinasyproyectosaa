"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/nav";
import { LogoMarca } from "./Logo";

export interface HeaderProps {
  nombre: string;
  cotizar: string;
}

export function Header({ nombre, cotizar }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menu remembers the route it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (fn: (v: boolean) => boolean) =>
    setOpenOn(fn(open) ? pathname : null);
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const [first, ...rest] = nombre.split(" y ");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
        overHero
          ? "bg-transparent text-bone"
          : "bg-bone/92 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-12">
        <Link
          href="/"
          className="group flex items-center gap-3 leading-none"
          aria-label={`${nombre} — inicio`}
        >
          <LogoMarca className="h-7 w-9 shrink-0 sm:h-8 sm:w-10" />
          <span className="flex items-baseline gap-2">
          <span className="display text-[1.55rem] sm:text-[1.75rem]">
            {first}
          </span>
          {rest.length > 0 && (
            <span className="font-serif text-[1.55rem] italic opacity-70 sm:text-[1.75rem]">
              y {rest.join(" y ")}
            </span>
          )}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-9 lg:flex"
          aria-label="Principal"
        >
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[0.82rem] font-medium tracking-wide transition-opacity hover:opacity-100 ${
                  active ? "opacity-100" : "opacity-70"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-current transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
          <Link
            href={cotizar}
            className={`rounded-full border px-5 py-2.5 text-[0.8rem] font-semibold tracking-wide transition-colors ${
              overHero
                ? "border-bone/50 hover:bg-bone hover:text-ink"
                : "border-ink bg-ink text-bone hover:bg-walnut hover:border-walnut"
            }`}
          >
            Cotizar proyecto
          </Link>
        </nav>

        <button
          type="button"
          className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`absolute h-px w-6 bg-current transition-transform duration-300 ${
              open ? "rotate-45" : "-translate-y-1"
            }`}
          />
          <span
            className={`absolute h-px w-6 bg-current transition-transform duration-300 ${
              open ? "-rotate-45" : "translate-y-1"
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 top-18 bottom-0 flex flex-col justify-between bg-bone px-5 pt-8 pb-10 text-ink transition-[opacity,visibility] duration-300 sm:px-8 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex flex-col" aria-label="Principal móvil">
          <Link href="/" className="display border-b border-line py-4 text-4xl">
            Inicio
          </Link>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="display border-b border-line py-4 text-4xl"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href={cotizar}
          className="flex h-14 items-center justify-center rounded-full bg-ink text-sm font-semibold tracking-wide text-bone"
        >
          Cotizar proyecto
        </Link>
      </div>
    </header>
  );
}
