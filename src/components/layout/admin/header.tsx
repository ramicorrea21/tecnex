'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth()

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : '??'

  return (
    <header className="border-b bg-white h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <Button 
        variant="ghost" 
        size="icon"
        className="md:hidden hover:bg-gray-100"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="rounded-full h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem disabled className="text-sm opacity-60">
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => signOut()}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}