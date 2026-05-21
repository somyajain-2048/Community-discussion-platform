"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { getSocket } from "./useSocket";

export interface AppNotification {
  id: string;
  type: "LIKE" | "COMMENT" | "REPLY" | "FOLLOW";
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: { id: string; username: string; avatar?: string };
  post?: { id: string; title: string };
}

export function useNotifications() {
  const { user, isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const joinedRef = useRef(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Initial fetch
  useEffect(() => {
    if (!isAuthenticated) return;
    apiClient
      .get("/notification")
      .then((res) => {
        if (res.data.success) setNotifications(res.data.data || []);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  // Socket — join personal room and listen for new notifications
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    const joinRoom = () => {
      socket.emit("join", user.id);
      joinedRef.current = true;
    };

    const onNotification = (notification: AppNotification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
    };

    socket.on("connect", joinRoom);
    socket.on("new_notification", onNotification);

    if (!socket.connected) {
      socket.connect();
    } else {
      joinRoom();
    }

    return () => {
      socket.off("connect", joinRoom);
      socket.off("new_notification", onNotification);
    };
  }, [user?.id]);

  const markRead = async (id: string) => {
    try {
      await apiClient.patch(`/notification/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await apiClient.patch("/notification/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  return { notifications, unreadCount, markRead, markAllRead };
}
