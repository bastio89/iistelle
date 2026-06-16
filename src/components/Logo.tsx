"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  href?: string;
}

/**
 * Zentrales iistelle Logo
 * Verwendet das SVG-Logo und kann an jeder Stelle eingebunden werden
 */
export function Logo({ size = 32, className = "", showText = false, href }: LogoProps) {
  const logoElement = (
    <>
      <Image
        src="/logo.svg"
        alt="iistelle Logo"
        width={size}
        height={size}
        className={`rounded-lg ${className}`}
        priority
      />
      {showText && (
        <span className="text-xl font-handwriting font-semibold tracking-wide text-petrol-900">
          iistelle
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center gap-2">
        {logoElement}
      </Link>
    );
  }

  return <div className="flex items-center gap-2">{logoElement}</div>;
}

/**
 * Kompakte Version für Navigation/Footer
 */
export function LogoCompact({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="iistelle"
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
      priority
    />
  );
}

/**
 * Sidebar-Logo mit Marke
 */
export function SidebarLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.svg"
        alt="iistelle"
        width={32}
        height={32}
        className="rounded-lg"
        priority
      />
      <span className="font-handwriting text-lg font-semibold text-petrol-900">iistelle</span>
    </div>
  );
}