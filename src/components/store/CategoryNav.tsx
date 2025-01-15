import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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
      <ScrollArea className="max-w-full">
        <div className="container mx-auto">
          <div className="flex h-12 items-center">
            <span className="flex items-center text-sm font-medium text-foreground/60 px-4">
              Categorías
            </span>
            <ul className="flex items-center gap-6">
              {categories.map((category) => (
                <li key={category}>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {category}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}