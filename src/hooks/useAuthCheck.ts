import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '@/stores/auth';

export const useAuthCheck = () => {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.PUBLIC_ENV === "DEV" ? "http://localhost:3000" : import.meta.env.PUBLIC_BACKEND_URL

  useEffect(() => {

    const checkSession = async () => {
      try {
        const res = await fetch(backendURL + '/auth/me', { credentials: 'include' }); // incluye cookies
        if (res.status === 200) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { user, loading };
};
