import { create } from 'zustand';
import { io } from "socket.io-client";
// const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
const apiUrl = window.location.hostname === 'localhost'
? "http://localhost:8000" : import.meta.env.VITE_APP_BASE_URL;

// Define the store
export const useStore = create((set,get) => ({
  onlineUsers: [],
  socket: null,
  userId: localStorage.getItem('userId') || null,
  setUserId: (id) => {
    // console.log("Setting userId:", id);
    localStorage.setItem('userId', id);
    set({ userId: id });
  },
  resetStore: () => {
    localStorage.clear();
    get().disconnectSocket();
    set({ userId: null,onlineUsers: [],socket: null });
  },
 connectSocket: () => {
    const userId = get().userId;

    // Don't connect if no userId
    if (!userId) return;

    // If socket exists, clean it up first
    if (get().socket) {
      get().socket.removeAllListeners();
      get().socket.disconnect();
    }

    // Create a fresh socket instance
    const socket = io(apiUrl, {
      query: { userId },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket });
  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
  // handleSocketDisconnect: () => {
  //   setTimeout(() => {
  //     // console.log("Reconnecting WebSocket...");
  //     get().connectSocket();
  //   }, 1000); // Retry connection after 1 second
  // },
  // monitorSocketConnection: () => {
  //   setInterval(() => {
  //     const userId = get().userId;
  //     // console.log("Monitoring socket connection, userId:", userId);
  //     if (!get().socket?.connected && userId) {
  //       // console.log("WebSocket not connected, attempting to reconnect...");
  //       get().connectSocket();
  //     }
  //     // console.log(get().socket?.connected ? "WebSocket connected" : "WebSocket not connected");
  //   }, 2000); // Check connection every 5 seconds
  // },
}));
export default useStore;