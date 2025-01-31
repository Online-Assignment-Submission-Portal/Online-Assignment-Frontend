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
  }, [userId]);

  useEffect(() => {
    if (!socket)
      return;
    socket.onclose = () => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      setTimeout(connectSocket, 1000); // Retry connection after 1 second
    };
  }, [socket])

  return (
    <div className="min-h-screen flex flex-col min-h- bg-gray-900 text-gray-200">

      <div className="p-4 max-w-lg mx-auto min-h-screen bg-gray-900 text-gray-200 space-y-4">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        <div className="flex flex-wrap justify-center sm:justify-end gap-4">

          <button
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold 
        rounded-lg transition "
            onClick={deleteReadNotifications}
          >
            Clear Read Notifications
          </button>
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold 
        rounded-lg transition "
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
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
    </div>
  );
};

export default Notification;
