import { useEffect, useState } from 'react';

interface UserInfo {
  user: string;
  role: string;
}

export function useCurrentUser() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loadingUser, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/account/me', {
      credentials: 'include', // very important for cookie auth!
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then((data) => {
        setUserInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setUserInfo(null);
        setLoading(false);
      });
  }, []);

  return { userInfo, loadingUser };
}
