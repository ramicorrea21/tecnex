'use client'

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useCategories } from "@/hooks/use-categories"
import { useBrands } from "@/hooks/use-brands"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryNav() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { brandsByCategory, loading: brandsLoading, error: brandsError } = useBrands()
  const pathname = usePathname()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())
  
  const loading = categoriesLoading || brandsLoading
  const error = categoriesError || brandsError

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click was outside all dropdowns
      const clickedOutside = Array.from(dropdownRefs.current.entries()).every(
        ([id, ref]) => !ref || !ref.contains(event.target as Node)
      )
      
      if (clickedOutside) {
        setActiveDropdown(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Set ref for a category
  const setDropdownRef = (id: string, el: HTMLDivElement | null) => {
    if (dropdownRefs.current) {
      dropdownRefs.current.set(id, el)
    }
  }

  // Get position style for dropdown
  const getDropdownPosition = (categoryId: string) => {
    const ref = dropdownRefs.current.get(categoryId)
    if (!ref) return {}
    
    const rect = ref.getBoundingClientRect()
    return {
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`
    }
  }

  // Toggle dropdown for a specific category
  const toggleDropdown = (categoryId: string) => {
    setActiveDropdown(prev => prev === categoryId ? null : categoryId)
  }

  // Function to check if a category or its brands are active
  const isCategoryActive = (categorySlug: string) => {
    const normalizedPathname = pathname.toLowerCase()
    const normalizedCategoryPath = `/${categorySlug.toLowerCase()}`
    return normalizedPathname === normalizedCategoryPath || 
           normalizedPathname.startsWith(`${normalizedCategoryPath}/`)
  }

  if (loading) {
    return (
      <div className="w-full border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-8 w-24 mx-2 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-center">
            <p className="text-sm text-destructive">Error al cargar las categorías</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full border-b bg-slate-50 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex w-full gap-1 px-4 sm:px-6 lg:px-8 overflow-x-auto py-2">
          {categories.map((category) => {
            const categoryBrands = brandsByCategory[category.id] || []
            const hasBrands = categoryBrands.length > 0
            const isActive = isCategoryActive(category.slug)
            const isDropdownOpen = activeDropdown === category.id
            const dropdownPosition = getDropdownPosition(category.id)
            
            return (
              <div 
                key={category.id} 
                className="flex-shrink-0 relative"
                ref={(el) => setDropdownRef(category.id, el)}
              >
                {hasBrands ? (
                  <>
                    <button 
                      className={cn(
                        "h-9 rounded-full px-4 text-sm font-medium bg-blue-100 hover:bg-blue-200 text-blue-800 flex items-center gap-1",
                        isActive && "bg-blue-200",
                        isDropdownOpen && "bg-blue-200"
                      )}
                      onClick={() => toggleDropdown(category.id)}
                    >
                      {category.name}
                      <ChevronDown className={cn(
                        "h-3.5 w-3.5 opacity-70 transition-transform",
                        isDropdownOpen && "transform rotate-180"
                      )} />
                    </button>
                    
                    {isDropdownOpen && (
                      <div 
                        className="fixed z-50 min-w-[180px]"
                        style={dropdownPosition}
                      >
                        <div className="bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <ul className="py-2">
                            <li>
                              <Link
                                href={`/${encodeURIComponent(category.name.toLowerCase())}`}
                                className="block px-4 py-2 hover:bg-blue-50 text-sm"
                                onClick={() => setActiveDropdown(null)}
                              >
                                Todos
                              </Link>
                            </li>
                            {categoryBrands.map(brand => (
                              <li key={`${category.id}-${brand}`}>
                                <Link
                                  href={`/${encodeURIComponent(category.name.toLowerCase())}?brand=${encodeURIComponent(brand)}`}
                                  className="block px-4 py-2 hover:bg-blue-50 text-sm"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {brand}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    href={`/${encodeURIComponent(category.name.toLowerCase())}`} 
                    className={cn(
                      "h-9 flex items-center rounded-full px-4 text-sm font-medium bg-blue-100 hover:bg-blue-200 text-blue-800",
                      isActive && "bg-blue-200"
                    )}
                  >
                    {category.name}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}