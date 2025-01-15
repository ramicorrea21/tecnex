import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Input 
        type="search" 
        placeholder="¿Qué estás buscando?" 
        className="w-full h-12 pl-12 pr-4 text-base transition-colors placeholder:text-muted-foreground/60"
      />
      <Search 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" 
      />
    </div>
  )
}