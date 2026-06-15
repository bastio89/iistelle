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
        alt="iistelle HR Logo"
        width={size}
        height={size}
        className={`rounded-lg ${className}`}
        priority
      />
      {showText && (
        <span className="text-lg font-bold tracking-tight text-petrol-900">
          iistelle HR
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
      alt="iistelle HR"
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
      <span className="font-bold text-petrol-900">iistelle HR</span>
    </div>
  );
}