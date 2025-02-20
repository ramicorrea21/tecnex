import { Search } from "lucide-react"

export function SearchBar() {
  return (
    <div className="relative w-full">
      <div className="flex items-center h-10 rounded-md border border-gray-200 bg-gray-50 px-3">
        <Search className="h-4 w-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Busca productos..."
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
        />
        <button className="ml-2 rounded-md bg-gray-100 px-2 h-7 text-xs text-gray-600">
          Buscar
        </button>
      </div>
    </div>
  )
}