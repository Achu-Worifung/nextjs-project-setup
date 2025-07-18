"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"


export function ModeToggle() {
  const {theme, setTheme } = useTheme()
  const changeTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (

        <Button variant="outline" size="icon" onClick={changeTheme} className="text-black dark:text-white">
          {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem] " />
          : <Moon className="absolute h-[1.2rem] w-[1.2rem] " />}
        </Button>
      
  )
}
