"use client"

import { cn } from "@/lib/utils"

interface Brand {
  name: string
  logo: string
}

const brands: Brand[] = [
  { name: "Nike", logo: "/nike-swoosh.png" },
  { name: "Adidas", logo: "/adidas-logo.png" },
  { name: "Apple", logo: "/apple-logo.png" },
  { name: "Google", logo: "/google-logo.png" },
  { name: "Microsoft", logo: "/microsoft-logo.png" },
  { name: "Amazon", logo: "/amazon-logo.png" },
  { name: "Meta", logo: "/meta-logo-abstract.png" },
  { name: "Tesla", logo: "/tesla-logo.png" },
  { name: "Netflix", logo: "/netflix-inspired-logo.png" },
  { name: "Spotify", logo: "/spotify-logo.png" },
]

interface SocialProofSectionProps {
  speed?: "slow" | "normal" | "fast"
}

export default function SocialProofSection({ speed = "normal" }: SocialProofSectionProps) {
  const speedClass = {
    slow: "animate-marquee-slow",
    normal: "animate-marquee",
    fast: "animate-marquee-fast",
  }[speed]

  return (
    <section className="mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Confían en nosotros</h2>
          <p className="text-muted-foreground">Confían en nosotros desde la prueba piloto</p>
        </div>

        <div className="relative overflow-hidden">
          {/* Gradient overlays para efecto fade */}
          <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

          {/* Contenedor del marquee */}
          <div className="flex overflow-hidden">
            <div className={cn("flex animate-marquee", speedClass)}>
              {/* Primera fila de logos */}
              {brands.map((brand, index) => (
                <div key={`first-${index}`} className="flex flex-col items-center justify-center mx-8 min-w-[120px]">
                  <div className="h-16 w-24 flex items-center justify-center mb-2 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src={brand.logo || "/placeholder.svg"}
                      alt={`${brand.name} logo`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground text-center">{brand.name}</span>
                </div>
              ))}

              {/* Segunda fila de logos (duplicada para continuidad) */}
              {brands.map((brand, index) => (
                <div key={`second-${index}`} className="flex flex-col items-center justify-center mx-8 min-w-[120px]">
                  <div className="h-16 w-24 flex items-center justify-center mb-2 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src={brand.logo || "/placeholder.svg"}
                      alt={`${brand.name} logo`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground text-center">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
