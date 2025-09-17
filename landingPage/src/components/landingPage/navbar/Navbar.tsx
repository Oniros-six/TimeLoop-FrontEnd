import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Menu, X } from "lucide-react"
import { useSmoothScroll } from "@/hooks/useSmoothScroll"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const smoothScroll = useSmoothScroll(() => setIsOpen(false));

  const navItems = [
    { name: "Características", href: "#features" },
    { name: "Como funciona", href: "#process" },
    { name: "Precios", href: "#plans" },
    { name: "Preguntas", href: "#faq" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a onClick={(event) => smoothScroll(event, "home")} aria-label="Ir al inicio">
              <img src="/logo.png" alt="TimeLoop Logo" className="w-26 cursor-pointer" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  onClick={(event) => smoothScroll(event, item.href)}
                  className="hover:cursor-pointer text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
              <Button asChild className="cursor-pointer hover:bg-primary/80 hover:text-white">
                <a href="/login" className="hover:cursor-pointer">
                  Iniciar sesión
                </a>
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <div className="relative">
                    {isOpen ? (
                      <X className="size-8 animate-in spin-in-180 duration-200" />
                    ) : (
                      <Menu className="size-8 animate-in spin-in-180 duration-200" />
                    )}
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent showCloseButton={false} className="w-screen h-screen max-w-none max-h-none p-0 m-0 rounded-none border-none bg-background/95 backdrop-blur-md">
                <DialogClose className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <X className="size-8" />
                  <span className="sr-only">Cerrar</span>
                </DialogClose>
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                  {navItems.map((item, index) => (
                    <a
                      key={item.name}
                      onClick={(event) => smoothScroll(event, item.href)}
                      className="text-foreground hover:text-primary text-2xl font-medium transition-colors duration-200 animate-in fade-in-0 slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item.name}
                    </a>
                  ))}
                  <Button asChild>
                    <a href="/login" className="hover:cursor-pointer">
                      Iniciar sesión
                    </a>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  )
}