import * as React from "react"
import Link from "next/link"
import {Menu} from "@/public/menu"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavigationBar()
{
    return (
        <div>
            <span>
                <Image
                    src="/logo.png"
            </span>
        </div>
          
    )
}

