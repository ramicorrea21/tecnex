import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { SearchBar } from "./SearchBar"
import Link from "next/link"

export function MainNav() {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="text-2xl md:text-3xl font-bold text-primary">
              TECNEX
            </Link>
          </div>

          {/* Search - hidden on mobile, shown on tablet and up */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <SearchBar />
          </div>

          {/* Cart */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 md:h-12 md:w-12 relative"
            >
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Search - shown below nav on mobile only */}
        <div className="md:hidden py-4">
          <SearchBar />
        </div>
      </div>
    </nav>
  )
}