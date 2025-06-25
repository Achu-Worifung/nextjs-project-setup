'use client'
import { useState } from "react"
import Link from "next/link"
import ProfileBubble from "@/components/ui/profile-bubble"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { 
  Plane, 
  Car, 
  Building2, 

} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  //  NavigationMenuContent,
  // NavigationMenuLink,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {ModeToggle} from '@/components/mode-to-toggle'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState("Flights") //higlight active section do it later
  const changeNav = (route: string) =>
  {
    console.log(active)
    setActive(route)
    document.getElementById(route)?.scrollIntoView({
      behavior: "smooth",
        block: 'nearest',   // Prevents vertical scroll
    });
  }

  return (
    <NavigationMenu className="w-full bg-gradient-to-r  px-4 md:px-8 py-4">
      <div className="flex w-full items-center justify-between">
        <Link href="/" className="flex items-center gap-4 cursor-pointer">
          <Image src="/logo.svg" alt="Logo" width={60} height={60} />
          <div className="text-xl md:text-3xl font-bold font-['Philosopher'] text-black">
            Infosys | Booking
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-10">
          <NavigationMenuList className="flex gap-15 items-center text-black text-lg font-semibold font-['Lato'] md:gap-8">
            {["Flights", "Hotels", "Vehicles"].map((label) => (
              <NavigationMenuItem key={label} onClick={() => changeNav(label)}>
                 <NavigationMenuTrigger className="bg-transparent text-black hover:bg-black/10">
                 {label === "Flights" && <Plane className="mr-2" />} {label === "Hotels" && <Building2 className="mr-2" />} {label === "Vehicles" && <Car className="mr-2" />} {label}
                </NavigationMenuTrigger>
                {/*<NavigationMenuContent className="p-4">{label} Options</NavigationMenuContent> */}
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <Link href="/mybookings">
                <NavigationMenuTrigger className="bg-transparent text-black hover:bg-black/10">
                  MyBooking
                </NavigationMenuTrigger>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ModeToggle/>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/loginSignin">
                <NavigationMenuTrigger className="bg-transparent text-black hover:bg-black/10">
                  Sign In
                </NavigationMenuTrigger>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
        <div className="lg:hidden flex items-center">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-black">
            {mobileOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

     {mobileOpen && (
  <div className="flex flex-col gap-4 mt-4 lg:hidden text-black text-lg font-['Lato']">
    {["Flights", "Hotels", "Cars", "MyBooking"].map((label) =>
      label === "MyBooking" ? (
    <Link
      key={label}
      href="/mybookings"
      className="px-2 py-1 hover:bg-black/10 rounded"
    >
      {label}
    </Link>
  ) : label === "Cars" ? (
    <Link
      key={label}
      href="/carBooking"
      className="px-2 py-1 hover:bg-black/10 rounded"
    >
      {label}
    </Link>
  ) : (
    <div key={label} className="px-2 py-1 hover:bg-black/10 rounded">
      {label}
    </div>
  )
)}
    {!isSignedIn && (
      <Link href="/loginSignin" className="px-2 py-1 hover:bg-black/10 rounded">
        Sign In
      </Link>
    )}
    {isSignedIn && (
      <div className="mt-4">
        <Link href="/profileSetting">
          <button className="p-0 bg-transparent border-none">
            <ProfileBubble
              name="Alan Rivera"
              avatarUrl="/demoprofile.jpg"
              size={50}
            />
          </button>
        </Link>
      </div>
    )}
  </div>
)}
    </NavigationMenu>
  );
}