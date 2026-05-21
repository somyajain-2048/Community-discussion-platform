"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, logout, setLoading]);

  return <>{children}</>;
}
