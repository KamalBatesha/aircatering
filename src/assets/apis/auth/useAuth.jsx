import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useAuthMutation from './AuthMutation';
import { useCartStore } from '../../store/cartStore';

const useAuth = () => {
  const { user, login, logout, setLoading, loading } = useAuthStore();
  const { loginRefreshMutation } = useAuthMutation();
  const location = useLocation();
  const { clearCart } = useCartStore();
  // 1. Basic auth check on mount and route changes
  useEffect(() => {
    if (location.pathname.includes("login")) {
      setLoading(false);
      return;
    }

    let storedUser;
    try {
      storedUser = JSON.parse(localStorage.getItem("user"));
    } catch {
      storedUser = null;
    }

    if (!storedUser) {
      if (user) {
        logout();
      }
      setLoading(false);
      return;
    }

    if (!user || user?.token !== storedUser?.token) {
      login(storedUser);
    }
    setLoading(false);
  }, [location.pathname, user]);

  // 2. Unconditional token refresh every 3 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem("user"));
      } catch { }

      // Don't refresh if there is no user or we are on the login page
      if (user && !window.location.pathname.includes("login")) {
        console.log("🔄 Running unconditional 3-minute token refresh");
        loginRefreshMutation.mutate({}, {
          onSuccess: (newUser) => {
            login(newUser);
            console.log("🔄 Token refreshed successfully");
          },
          onError: () => {
            console.log("❌ Scheduled refresh failed");
            logout();
            clearCart();
          },
        });
      }
    }, 180000); // 180,000 ms = 3 minutes

    return () => clearInterval(intervalId);
  }, []);

  return { user, isLoading: loading };
};

export default useAuth;
