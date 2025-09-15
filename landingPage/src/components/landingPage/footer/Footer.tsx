import { Instagram, Mail, Phone } from "lucide-react"
import { useSmoothScroll } from "@/hooks/useSmoothScroll"

export default function Footer() {
  const smoothScroll = useSmoothScroll();

  const navItems = [
    { name: "Inicio", href: "#home" },
    { name: "Características", href: "#features" },
    { name: "Como funciona", href: "#process" },
    { name: "Precios", href: "#plans" },
    { name: "Preguntas", href: "#faq" },
  ]

  return (
    <footer className="bg-background-alt border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">TimeLoop</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              La mejor forma de transformar la experiencia de tu negocio.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Navegación</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    onClick={(event) => smoothScroll(event, item.href)}
                    className="hover:cursor-pointer text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground text-sm">info@timeloop.com.uy</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground text-sm">092 601 809</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Síguenos en instagram</h4>
            <div className="flex gap-3">
              <a
                target="_blank" rel="noopener noreferrer"
                href="https://www.instagram.com/timeloop.uy/"
                className="p-2 rounded-lg bg-card hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">© 2025 TimeLoop. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="/privacidad"
                className="hover:cursor-pointer text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Política de Privacidad
              </a>
              <a href="/tyc"
                className="hover:cursor-pointer text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Términos de Servicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
