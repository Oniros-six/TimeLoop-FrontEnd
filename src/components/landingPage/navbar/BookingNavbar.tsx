import { Button } from "@/components/ui/button"

export default function BookingNavbar() {

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" aria-label="Ir al inicio">
                            <img src="/logo.png" alt="TimeLoop Logo" className="w-26 cursor-pointer" />
                        </a>
                    </div>

                    <h1 className="hidden sm:block text-2xl font-bold text-primary">
                        TimeLoop
                    </h1>

                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <a href="/login" className="hover:cursor-pointer">
                                Iniciar sesión
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}