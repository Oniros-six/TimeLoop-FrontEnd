import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Características", href: "#features" },
    { name: "Precios", href: "#pricing" },
    { name: "Preguntas", href: "#faq" },
    { name: "Contacto", href: "#contact" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src="/logo.png" alt="TimeLoop Logo" className="w-26" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <div className="relative w-6 h-6">
                    {isOpen ? (
                      <X className="h-6 w-6 animate-in spin-in-180 duration-200" />
                    ) : (
                      <Menu className="h-6 w-6 animate-in spin-in-180 duration-200" />
                    )}
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 m-0 rounded-none border-none bg-background/95 backdrop-blur-md">
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                  {navItems.map((item, index) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-foreground hover:text-primary text-2xl font-medium transition-colors duration-200 animate-in fade-in-0 slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  )
}