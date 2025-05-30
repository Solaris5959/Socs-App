"use client"

import {
  Rss,
  CircleUserRound,
  MessageCircleMore,
  Bell,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from "next/navigation"


// User sidebar component
export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { signOut } = useAuth();
  const router = useRouter()

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to the login page or perform any other action after sign out
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle error (e.g., show a notification)
    }
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {/* User Profile Detail */}
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* User menu */}
            <DropdownMenuGroup>

              {/* Profile Page*/}
              <a href="/dashboard/profile"  >
                <DropdownMenuItem className="cursor-pointer" >
                  <CircleUserRound />
                  Profile
                </DropdownMenuItem>
              </a>

              {/* My post Page*/}
              <a href="/dashboard/myposts" >
                <DropdownMenuItem className="cursor-pointer" >
                  <Rss />
                  My Posts
                </DropdownMenuItem>
              </a>

              {/* Chat Page*/}
              <a href="/dashboard/chats" >
                <DropdownMenuItem className="cursor-pointer" >
                  <MessageCircleMore />
                  Chats
                </DropdownMenuItem>
              </a>

              {/* Notifications Page whrere user get reuqest*/}
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <button onClick={handleSignOut} className="w-full text-left">
              <DropdownMenuItem className="cursor-pointer" >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu >
  )
}
