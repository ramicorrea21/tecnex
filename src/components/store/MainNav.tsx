import Link from "next/link"
import { SearchBar } from "./SearchBar"
import { CartDropdown } from "../cart/CartDropdown"

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

          {/* Search - hidden on mobile */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <SearchBar />
          </div>

          {/* Cart */}
          <div className="flex items-center gap-4">
            <CartDropdown />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-4">
          <SearchBar />
        </div>
      </div>
    </nav>
  )
}