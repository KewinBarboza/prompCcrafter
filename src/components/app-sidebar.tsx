import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import Link from "next/link"
import { ArrowBigLeft } from "lucide-react"

const items = [
  {
    title: "Home",
    url: "#",
    icon: "",
  },
  {
    title: "Inbox",
    url: "#",
    icon: "",
  },
  {
    title: "Calendar",
    url: "#",
    icon: "",
  },
  {
    title: "Search",
    url: "#",
    icon: "",
  },
  {
    title: "Settings",
    url: "#",
    icon: "",
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarHeader className="flex">
        <Button size="lg" asChild>
          <Link href='/created-prompt'>Crear prompt</Link>
        </Button>

        <Button size="lg" variant="outline" asChild>
          <Link href='/'><ArrowBigLeft /></Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {/* <item.icon /> */}
                      <span>{item.title}</span>
                    </a>
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
