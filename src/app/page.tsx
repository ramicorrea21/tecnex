import { MainNav } from "@/components/store/MainNav"
import { CategoryNav } from "@/components/store/CategoryNav"
import { Banner } from "@/components/store/Banner"
import { Offers } from "@/components/store/Offers" // Importamos el componente de Ofertas

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <CategoryNav />
      <Banner />
      <Offers /> 
    </div>
  )
}