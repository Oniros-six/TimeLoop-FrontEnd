import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '@/stores/auth';

export const useAuthCheck = () => {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/verify', { 
          method: 'GET',
          credentials: 'include' 
        });
        
        if (res.status === 200) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error verificando sesión:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { user, loading };
};
