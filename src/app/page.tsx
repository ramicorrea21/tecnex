import { MainNav } from "@/components/store/MainNav"
import { CategoryNav } from "@/components/store/CategoryNav"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Contenido principal irá aquí */}
        </div>
      </main>
    </div>
  )
}