import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function handleRadioToTextarea(e: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = e.target
  const textarea = document.querySelector(`textarea[name='${name}']`) as HTMLTextAreaElement

  if (textarea) {
    textarea.value = value
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }
}
