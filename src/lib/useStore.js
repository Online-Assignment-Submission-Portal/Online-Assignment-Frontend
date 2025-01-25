import { create } from 'zustand';
import { io } from "socket.io-client";
const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"

// Define the store
export const useStore = create((set,get) => ({
  // isOnline: false, // Initial state
  onlineUsers: [],
  socket: null,
  userId: null,
  setUserId: (id) => set({ userId: id }), // Action to update the state
  connectSocket: () => {
    if(get().socket?.connected) return;
    const socket = io(apiUrl,{
      query:{
        userId: get().userId,
      },
    })
    socket.connect()
    set({ socket:socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    })
  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
}));

export default useStore;