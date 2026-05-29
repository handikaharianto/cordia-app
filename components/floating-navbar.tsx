"use client"

import Link from "next/link"
import {
  IconChalkboardTeacher,
  IconHome,
  IconMessageCircle,
  IconMoon,
  IconSettings,
  IconSun,
  IconUser,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { label: "Home", href: "/", icon: IconHome },
  {
    label: "Classroom Finder",
    href: "/classroom-finder",
    icon: IconChalkboardTeacher,
  },
  { label: "Messages", href: "#", icon: IconMessageCircle },
  { label: "Profile", href: "#", icon: IconUser },
  { label: "Settings", href: "#", icon: IconSettings },
]

export function FloatingNavbar() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <ul className="flex items-center gap-1 rounded-full border border-border bg-background/80 p-1.5 shadow-lg backdrop-blur-md">
        {navItems.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  asChild
                  variant={pathname === href ? "default" : "ghost"}
                  size="icon-lg"
                  aria-label={label}
                >
                  <Link href={href}>
                    <Icon />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          </li>
        ))}
        <Separator orientation="vertical" />
        <li className="flex items-center gap-1.5 px-2">
          <IconSun
            className={`size-4 transition-all duration-300 ${
              resolvedTheme === "dark"
                ? "text-muted-foreground"
                : "text-foreground"
            }`}
          />
          <Switch
            checked={resolvedTheme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Toggle theme"
          />
          <IconMoon
            className={`size-4 transition-all duration-300 ${
              resolvedTheme === "dark"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          />
        </li>
      </ul>
    </nav>
  )
}
