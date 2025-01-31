import React, { useEffect } from "react";
import useNotificationStore from "../lib/notificationStore";
import useStore from "../lib/useStore";

const Notification = () => {
  const { notifications, fetchNotifications, listenForNotifications, deleteReadNotifications } = useNotificationStore();
  const { userId, socket, connectSocket } = useStore();

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      listenForNotifications();
    }
  }, [userId]);

    useEffect(() => {
      if(!socket)
        return;
      socket.onclose = () => {
        console.log("WebSocket disconnected, attempting to reconnect...");
        setTimeout(connectSocket, 1000); // Retry connection after 1 second
      };
    },[socket])

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <button 
        className="bg-red-500 text-white px-4 py-2 rounded mb-3" 
        onClick={deleteReadNotifications}
      >
        Clear Read Notifications
      </button>
      <ul className="bg-white shadow-lg rounded-lg p-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <li key={index} className="border-b py-2">
              <p><strong>{notification.senderId?.firstName} {notification.senderId?.lastName}</strong>: {notification.content}</p>
              <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notification;
