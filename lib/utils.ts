import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert "09.00.00" to "09:00:00"
export const formatTime = (time: string): string => {
  return time.replace(/\./g, ":")
}

// Convert "11/05/2026" to "2026-05-11"
export const formatDate = (date: string): string => {
  const [day, month, year] = date.split("/")
  return `${year}-${month}-${day}`
}
