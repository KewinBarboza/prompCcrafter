"use client"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { MoveLeft } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function AppSidebar() {
  // get data prompts of local storage
  const [items, setItems] = useState<[{ id: number, text: string, date: Date, name: string }] | []>([])

  useEffect(() => {
    setItems([])
    const getStorage = localStorage.getItem('prompt')
    if (getStorage) {
      const parsed = JSON.parse(getStorage)
      setItems(parsed)
    }
  }, [])

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <Button variant="link" className="flex justify-start" asChild>
          <Link href='/'><MoveLeft />Volver atrás</Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link className="text-start" href={`/prompt?id=${item.id}`}>
                      <span className="block">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
