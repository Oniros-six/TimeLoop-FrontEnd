import { useAtom } from 'jotai';
import { userAtom } from '@/stores/auth';

const LogoutButton = () => {
  const [, setUser] = useAtom(userAtom);

  const handleLogout = async () => {
    await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null); // limpia estado
    window.location.href = '/login';
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
