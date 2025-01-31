import React, { useEffect } from "react";
import useNotificationStore from "../lib/notificationStore";
import useStore from "../lib/useStore";
import { useNavigate } from "react-router-dom";



const Notification = () => {
  const { notifications, fetchNotifications, listenForNotifications, deleteReadNotifications } = useNotificationStore();
  const { userId, socket, connectSocket } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      listenForNotifications();
    }
  }, [userId, socket]);

    useEffect(() => {
      if(!socket)
        return;
      socket.onclose = () => {
        console.log("WebSocket disconnected, attempting to reconnect...");
        setTimeout(connectSocket, 1000); // Retry connection after 1 second
      };
    },[socket])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-4 sm:py-8">
      <div className="container mx-auto max-w-md">
      <h2 className="text-3xl text-center font-bold mb-4 hover:text-4xl hover:text-gray-400 duration-300 ease-in">Notifications</h2>
      <div className="flex justify-between mb-4">
      <button 
        className="bg-red-500 text-white px-4 py-2 rounded mb-3 hover:bg-red-900 hover:font-bold duration-300 ease-in" 
        onClick={() => navigate(-1)}
      >
        back
      </button>
      <button 
        className="bg-red-500 text-white px-4 py-2 rounded mb-3 hover:bg-red-900 hover:font-bold duration-100 ease-in" 
        onClick={deleteReadNotifications}
      >
        Clear Notifications
      </button>
      </div>
      <ul className="bg-white shadow-lg rounded-lg p-4">
        {notifications.length === 0 ? (
          <p className="text-purple-600 text-center text-xl">No notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <li key={index} className="border-b py-2">
              <p className="text-purple-600"><strong className="text-fuchsia-600">{notification.senderId?.firstName} {notification.senderId?.lastName}</strong>: {notification.content}</p>
              <span className="text-xs text-purple-600">{new Date(notification.createdAt).toLocaleString()}</span>
            </li>
          ))
        )}
      </ul>
      </div>
    </div>
  );
};

export default Notification;
