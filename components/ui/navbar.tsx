'use client'
import { useState } from "react"
import Link from "next/link"
import ProfileBubble from "@/components/ui/profile-bubble"
import Image from "next/image"
import { Menu, X } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <NavigationMenu className="w-full bg-gradient-to-r from-cyan-100 to-blue-200 px-4 md:px-8 py-4 pt-8">
      <div className="flex w-full items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="Logo" width={50} height={50} />
          <div className="text-xl md:text-3xl font-bold font-['Philosopher'] text-black">
            Infosys | Booking
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <NavigationMenuList className="flex gap-15 items-center text-black text-lg font-semibold font-['Lato'] md:gap-8">
            {["Flights", "Hotels", "Cars", "MyBooking"].map((label) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuTrigger className="bg-transparent text-black hover:bg-black/10">
                  {label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-4">{label} Options</NavigationMenuContent>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <Link href="/loginSignin">
                <NavigationMenuLink className="bg-transparent text-black hover:bg-black/10">
                  Sign In
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <ProfileBubble
            name="Alan Rivera"
            avatarUrl="/demoprofile.jpg"
            size={50}
          />
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-black">
            {mobileOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileOpen && (
        <div className="flex flex-col gap-4 mt-4 lg:hidden text-black text-lg font-['Lato']">
          {["Flights", "Hotels", "Cars", "MyBooking"].map((label) => (
            <div key={label} className="px-2 py-1 hover:bg-black/10 rounded">
              {label}
            </div>
          ))}
          <Link href="/loginSignin" className="px-2 py-1 hover:bg-black/10 rounded">
            Sign In
          </Link>
          <div className="mt-4">
            <ProfileBubble
              name="Alan Rivera"
              avatarUrl="/demoprofile.jpg"
              size={50}
            />
          </div>
        </div>
      )}

      <NavigationMenuViewport />
    </NavigationMenu>
  )
}
