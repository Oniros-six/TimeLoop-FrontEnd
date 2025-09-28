import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/auth';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  const [, setUser] = useAtom(userAtom);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null); // limpia estado solo si el logout fue exitoso
        window.location.href = '/login';
      } else {
        console.error('Error en logout:', await response.json());
        // Aún así limpiar el estado local por seguridad
        setUser(null);
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error de conexión en logout:', error);
      // Limpiar estado local por seguridad
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <Button className="w-fit flex items-center gap-2 hover:cursor-pointer bg-transparent text-foreground hover:bg-destructive !px-4" onClick={handleLogout}>
      <LogOut />
      <span>Cerrar sesión</span>
    </Button>
  )

};

export default LogoutButton;
