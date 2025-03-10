import { create } from "zustand";
import axios from "axios";
import useStore from "./useStore";

const apiUrl = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : import.meta.env.VITE_APP_BASE_URL;

export const useNotificationStore = create((set, get) => ({
  notifications: [],

  // Fetch notifications
  fetchNotifications: async () => {
    const userId = useStore.getState().userId;
    if (!userId) return;

    try {
      const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
      const res = await axios.get(`${apiUrl}/notification/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      set({ notifications: res.data });
    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data || err.message);
    }
  },

  // Add new notification (used when receiving a WebSocket event)
  addNotification: (notification) => {
    set((state) => ({ notifications: [notification, ...state.notifications] }));
  },

  // Delete all read notifications
  deleteReadNotifications: async () => {
    const userId = useStore.getState().userId;
    if (!userId) return;

    try {
      const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
      await axios.delete(`${apiUrl}/notification/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      set((state) => ({ notifications: state.notifications.filter(n => n.status !== "read") }));
    } catch (err) {
      console.error("Error deleting notifications:", err.response?.data || err.message);
    }
  },

  // Listen for real-time notifications via WebSocket
  listenForNotifications: () => {
    const socket = useStore.getState().socket;
    if (!socket) return;

    socket.on("updateNotifications", (notification) => {
      get().addNotification(notification);
    });
  },
}));

export default useNotificationStore;
