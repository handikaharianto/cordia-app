"use client"

import { IconMoon, IconSun } from "@tabler/icons-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <span className="text-lg font-bold tracking-tight">cordia</span>
        <div className="flex items-center gap-1.5">
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
        </div>
      </div>
    </header>
  )
}
