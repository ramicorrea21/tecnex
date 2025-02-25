'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const banners = [
  {
    id: 1,
    desktop: '/banner/desktop-1.svg',
    mobile: '/banner/mob-1.svg',
    alt: 'Banner 1'
  },
  {
    id: 2,
    desktop: '/banner/desktop-2.svg',
    mobile: '/banner/mob-2.svg',
    alt: 'Banner 2'
  },
  {
    id: 3,
    desktop: '/banner/desktop-3.svg',
    mobile: '/banner/mob-3.svg',
    alt: 'Banner 3'
  }
]

export function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es móvil al cargar y al cambiar el tamaño de ventana
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Ejecutar al inicio
    checkIsMobile()
    
    // Agregar listener para cambios de tamaño con debounce para mejor rendimiento
    let timeoutId: NodeJS.Timeout | undefined;
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 100);
    };
    
    window.addEventListener('resize', handleResize)
    
    // Limpiar listener
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    }
  }, [])

  // Auto slide cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  return (
    <div className="relative w-full max-w-full h-auto overflow-hidden">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div 
            key={banner.id}
            className="flex-none w-full relative"
          >
            <Image
              src={isMobile ? banner.mobile : banner.desktop}
              alt={banner.alt}
              fill={false}
              width={1000}
              height={400}
              className="w-full h-auto"
              sizes="100vw"
              priority
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
        onClick={prevSlide}
        aria-label="Anterior banner"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
        onClick={nextSlide}
        aria-label="Siguiente banner"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir al banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}