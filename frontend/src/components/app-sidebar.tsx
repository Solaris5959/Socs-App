"use client"

import * as React from "react"
import {
  House, Contact,
  FolderKanban, MessageCircleMore,
  LifeBuoy,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"

import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Image from "next/image"
import logoImage from "@/assets/trans-logo-only.png";


// Config for the sidebar
const sidebarData = {

  // User Profile
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },


  // Main navigation
  navMain: [
    {
      title: "Home",
      url: "/dashboard/",
      icon: House,
      isActive: true,
      items: [
        {
          title: "My Posts",
          url: "/dashboard/myposts",
        },
        {
          title: "Favorite Posts",
          url: "/dashboard/favorites",
        },

      ]


    },
    {
      title: "My Connections",
      url: "/dashboard/connections",
      icon: Contact,

    },
    {
      title: "Chats",
      url: "/dashboard/chats",
      icon: MessageCircleMore,

    },
    {
      title: "Workspace",
      url: "/dashboard/workspace",
      icon: FolderKanban,
    },

  ],

  // Secondary navigation
  navSecondary: [
    {
      title: "Support",
      url: "/dashboard/support",
      icon: LifeBuoy,
    },

  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <Image
                  src={logoImage}
                  alt="SOCS Logo"
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                />
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-medium truncate">SOCS</span>
                  <span className="text-xs truncate">Social App</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Render-side bar content */}
      <SidebarContent>

        {/* Render-side bar menu */}
        <NavMain items={sidebarData.navMain} />
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>


      <SidebarFooter>
        {/* Render user menu */}
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
