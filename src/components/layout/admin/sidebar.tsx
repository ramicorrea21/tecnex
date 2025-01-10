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
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">
          Admin Panel
        </h2>
        <div className="space-y-1">
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
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
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
      <nav className={cn("flex flex-col h-screen", className)}>
        <NavItems onCloseMobile={onCloseMobile} />
      </nav>

      {/* Mobile sidebar */}
      <Sheet open={showMobile} onOpenChange={onCloseMobile}>
        <SheetContent side="left" className="w-64 p-0">
          <NavItems onCloseMobile={onCloseMobile} />
        </SheetContent>
      </Sheet>
    </>
  )
}