import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const categories = [
  "Televisores",
  "Smartphone",
  "Smart TV",
  "Auriculares",
  "iPhone",
  "Tablets",
  "Laptops",
  "Accesorios"
]

export function CategoryNav() {
  return (
    <div className="relative border-b bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-center">
          <div className="flex items-center overflow-x-auto w-full">
            <span className="flex-none text-sm font-medium text-foreground/60 px-4">
              Categorías
            </span>
            <ul className="flex items-center gap-6 flex-nowrap">
              {categories.map((category) => (
                <li key={category} className="flex-none">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
                  >
                    {category}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}