import Link from "next/link"
import { SearchBar } from "./SearchBar"
import { CartDropdown } from "../cart/CartDropdown"

export function MainNav() {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="text-3xl font-bold tracking-wider text-blue-100 relative">
              <span className="bg-gradient-to-b from-blue-200 to-blue-300 bg-clip-text text-transparent drop-shadow-sm">
                TECNEX
              </span>
            </Link>
          </div>

          {/* Search - centered */}
          <div className="flex flex-1 items-center justify-center px-8 max-w-md mx-auto">
            <SearchBar />
          </div>

          {/* Cart */}
          <div className="flex items-center gap-2">
            <CartDropdown />
          </div>
        </div>
      </div>
    </nav>
  )
}