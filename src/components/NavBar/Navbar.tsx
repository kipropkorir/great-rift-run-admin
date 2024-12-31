"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
interface NavbarProps {
  className?: string;
}

import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "DASHBOARD", href: "/" },
    { name: "PRODUCTS", href: "/Products" },
    { name: "ORDERS", href: "/Orders" },
    { name: "BLOGS", href: "/blogs" },
    { name: "CONTACTS", href: "/contacts" },
  ];

  return (
    <nav className={`w-full bg-[#0a0f1400] ${className || ""}`}>
      <div className="w-full px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/site-ui-assets/placeholder.svg"
                alt="Great Rift Run"
                width={150}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </Link>

          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between">
              <div className="ml-10 flex items-center space-x-12">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm md:px-5 lg:px-10 tracking-wider text-[#000000] transition-colors hover:text-[#515151]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="p-0">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#000000]"
              >
                <Image
                  src={"/site-ui-assets/bx-menu-alt-right.svg"}
                  alt="Open menu"
                  width={50}
                  height={50}
                />
                <span className="sr-only">Open menu</span>
              </button>

              {isOpen && (
                <div className="fixed inset-0 z-50 bg-white">
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-black flex items-center justify-center h-[60px] w-[60px] rounded-full hover:bg-gray-100 transition duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      <span className="sr-only">Close menu</span>
                    </button>
                  </div>

                  <div className="flex flex-col justify-center h-full w-1/2 mx-auto space-y-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-center text-3xl text-black hover:bg-gray-100 py-4"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
