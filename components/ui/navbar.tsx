'use client'
import { useState } from "react"
import Link from "next/link"
import ProfileBubble from "@/components/ui/profile-bubble"
import Image from "next/image"
import {useAuth} from "@/context/AuthContext"
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
} from "@/components/ui/navigation-menu"
import {ModeToggle} from '@/components/mode-to-toggle'
import { useTheme } from "next-themes";
import { decodeJWT } from '@/lib/auth-utils';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme } = useTheme();
  const [active, setActive] = useState("Flights") //higlight active section do it later
  const {token, isSignedIn} = useAuth();

  const router = useRouter();



  const changeNav = (route: string) =>
  {
    console.log(active)
    setActive(route)
    document.getElementById(route)?.scrollIntoView({
      behavior: "smooth",
        block: 'nearest',   // Prevents vertical scroll
    });
  }

  //this will return the signed in user or button 
  const renderAuthButton = () => {
    if (isSignedIn && token) {
      const decode = decodeJWT(token);
      // console.log("decoded token from navbar", decode);
      console.log(decode);
      return (
        <div>
          <Link href="/profileSetting">
            <button className="p-0 bg-transparent border-none cursor-pointer" onClick={() => router.push('/profileSetting')}>
              <ProfileBubble
                name={decode?.firstName || decode?.email || "User"}
                size={35}
              />
            </button>
          </Link>
        </div>
      );
    } else {
      return (
        <NavigationMenuItem className="cursor-pointer">
          <Link href="/signin">
            <NavigationMenuTrigger className="p-2 bg-transparent border-none">
              Login
            </NavigationMenuTrigger>
        </Link>
        </NavigationMenuItem>
      );
    }
  }

  return (

    <NavigationMenu className="w-full bg-gradient-to-r  px-4 md:px-8 py-4">

      <div className="flex w-full items-center justify-between">
        <Link href="/" className="flex items-center gap-4 cursor-pointer">
          <Image src="/logo.svg" alt="Logo" width={60} height={60} />
          <h2 className={`text-xl md:text-3xl font-bold font-['Philosopher'] ${
              theme === "dark" ? "text-white" : "text-brand-gray-900"
            }`}>
            Infosys | Booking
          </h2>
        </Link>
        <div className="hidden lg:flex items-center gap-10">
          <NavigationMenuList className={`flex gap-15 items-center text-lg font-semibold font-['Lato'] md:gap-8`}>
  {["Flights", "Hotels", "Vehicles"].map((label) => (
    <NavigationMenuItem key={label} onClick={() => changeNav(label)} id={label.toLowerCase()}>
      <NavigationMenuTrigger
        className={`bg-transparent transition-all duration-200 ${
          theme === "dark" 
            ? "text-white hover:bg-[rgb(35,42,49)] hover:text-brand-pink-400" 
            : "text-brand-gray-900 hover:bg-brand-gray-100 hover:text-brand-pink-600"
        }`}
      >
        {label === "Flights" && <Plane className="mr-2" />} 
        {label === "Hotels" && <Building2 className="mr-2" />} 
        {label === "Vehicles" && <Car className="mr-2" />} 
        {label}
      </NavigationMenuTrigger>
    </NavigationMenuItem>
  ))}
  <NavigationMenuItem>
    <Link href={token ? "/mybookings" : "/signin"}>
      <NavigationMenuTrigger
        className={`bg-transparent transition-all duration-200 ${
          theme === "dark" 
            ? "text-white hover:bg-[rgb(35,42,49)] hover:text-brand-pink-400" 
            : "text-brand-gray-900 hover:bg-brand-gray-100 hover:text-brand-pink-600"
        }`}
      >
        MyBooking
      </NavigationMenuTrigger>
    </Link>
  </NavigationMenuItem>
  <NavigationMenuItem>
    <ModeToggle/>
  </NavigationMenuItem>
  {renderAuthButton()}
</NavigationMenuList>
        </div>
        <div className="lg:hidden">
  <button
    onClick={() => setMobileOpen(!mobileOpen)}
    className="absolute right-4 top-3 w-8 h-6 flex flex-col justify-between items-center z-50 focus:outline-none"
    aria-label="Toggle menu"
    type="button"
  >
    <span
      className={`block h-[3px] w-8 rounded transition-all duration-300 
        ${mobileOpen ? "translate-y-[10px] rotate-45" : ""}
        ${theme === "dark" ? "bg-white" : "bg-black"}
      `}
    />
    <span
      className={`block h-[3px] w-8 rounded transition-all duration-300 
        ${mobileOpen ? "opacity-0" : ""}
        ${theme === "dark" ? "bg-white" : "bg-black"}
      `}
    />
    <span
      className={`block h-[3px] w-8 rounded transition-all duration-300 
        ${mobileOpen ? "-translate-y-[13px] -rotate-45" : ""}
        ${theme === "dark" ? "bg-white" : "bg-black"}
      `}
    />
  </button>
</div>
      </div>

      {mobileOpen && (
  <div
    className={`fixed top-0 left-0 w-full h-full z-30 flex flex-col gap-4 pt-24 px-6 text-lg font-['Lato'] animate-slide-down transition-all duration-300 ease-in-out lg:hidden shadow-xl
      ${theme === "dark" 
        ? "bg-[rgb(25,30,36)]/95 backdrop-blur-sm text-white" 
        : "bg-white/95 backdrop-blur-sm text-black"
      }`}
  >
    <button
      onClick={() => setMobileOpen(false)}
      className={`absolute top-6 right-6 z-40 ${
        theme === "dark" ? "text-white" : "text-black"
      }`}
      aria-label="Close menu"
    >
     
    </button>
    {["Flights", "Hotels", "Cars", "MyBooking"].map((label) =>
  label === "MyBooking" ? (
    <Link
      key={label}
      href="/mybookings"
      className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
        theme === "dark" 
          ? "text-white hover:bg-[rgb(35,42,49)] hover:text-brand-pink-400" 
          : "text-brand-gray-900 hover:bg-brand-gray-100 hover:text-brand-pink-600"
      }`}
      onClick={() => setMobileOpen(false)}
    >
      {label}
    </Link>
  ) : (
    <div
      key={label}
      onClick={() => {
        changeNav(label === "Cars" ? "Vehicles" : label);
        setMobileOpen(false);
      }}
      className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 font-medium ${
        theme === "dark" 
          ? "text-white hover:bg-[rgb(35,42,49)] hover:text-brand-pink-400" 
          : "text-brand-gray-900 hover:bg-brand-gray-100 hover:text-brand-pink-600"
      }`}
    >
      {label}
    </div>
  )
)}
         {!isSignedIn && (
      <Link
        href="/loginSignin"
        className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
          theme === "dark" 
            ? "text-white hover:bg-[rgb(35,42,49)] hover:text-brand-pink-400" 
            : "text-brand-gray-900 hover:bg-brand-gray-100 hover:text-brand-pink-600"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        Sign In
      </Link>
    )}
    {isSignedIn && token && renderAuthButton()}
  </div>
)}

    </NavigationMenu>
  );
}

