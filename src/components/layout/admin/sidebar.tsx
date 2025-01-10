'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ListTree } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Productos', 
    href: '/admin/dashboard/products', 
    icon: Package 
  },
  { 
    name: 'Categorías', 
    href: '/admin/dashboard/categories', 
    icon: ListTree 
  }
]

interface NavItemsProps {
  onCloseMobile: () => void
}

function NavItems({ onCloseMobile }: NavItemsProps) {
  const pathname = usePathname()
  
  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <Separator />
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onCloseMobile()
                }
              }}
            >
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start hover:bg-gray-100",
                  pathname === item.href && "bg-gray-100 hover:bg-gray-200"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

interface SidebarProps {
  className?: string
  showMobile: boolean
  onCloseMobile: () => void
}

export function Sidebar({ className, showMobile, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <nav className={cn("border-r bg-white", className)}>
        <NavItems onCloseMobile={onCloseMobile} />
      </nav>

      {/* Mobile sidebar */}
      <Sheet open={showMobile} onOpenChange={onCloseMobile}>
        <SheetContent 
          side="left" 
          className="w-[280px] p-0"
        >
          <NavItems onCloseMobile={onCloseMobile} />
        </SheetContent>
      </Sheet>
    </>
  )
}