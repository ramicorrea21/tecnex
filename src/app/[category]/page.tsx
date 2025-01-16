import { MainNav } from "@/components/store/MainNav"
import { CategoryNav } from "@/components/store/CategoryNav"
import { Suspense } from "react"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

function CategoryContent({ category }: { category: string }) {
  return (
    <h1 className="text-2xl font-bold">
      {decodeURIComponent(category)}
    </h1>
  )
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<div>Cargando...</div>}>
            <CategoryContent category={category} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}