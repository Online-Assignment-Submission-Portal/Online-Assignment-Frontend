import { create } from 'zustand';
import { io } from "socket.io-client";
// const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
const apiUrl = window.location.hostname === 'localhost'
? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;

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
    if (!userId) {
      // console.log("userId is null, cannot connect socket");
      return;
    }
    // console.log("Connecting socket with userId:", userId);
    if(get().socket?.connected) return;
    const socket = io(`${apiUrl}`,{
      query:{
        userId,
      },
    })
    socket.connect()
    set({ socket:socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    })
    socket.on("disconnect", () => {
      // console.log("WebSocket disconnected, attempting to reconnect...");
      get().handleSocketDisconnect();
    });
  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
  handleSocketDisconnect: () => {
    setTimeout(() => {
      // console.log("Reconnecting WebSocket...");
      get().connectSocket();
    }, 1000); // Retry connection after 1 second
  },
  monitorSocketConnection: () => {
    setInterval(() => {
      const userId = get().userId;
      // console.log("Monitoring socket connection, userId:", userId);
      if (!get().socket?.connected && userId) {
        // console.log("WebSocket not connected, attempting to reconnect...");
        get().connectSocket();
      }
      // console.log(get().socket?.connected ? "WebSocket connected" : "WebSocket not connected");
    }, 2000); // Check connection every 5 seconds
  },
}));
export default useStore;