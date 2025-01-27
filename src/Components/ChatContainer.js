import React, { useState, useEffect } from 'react';
import { useLocation , useNavigate} from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios'; // Import Axios
import useStore from '../lib/useStore';
// import { useNavigate } from 'react-router-dom';

function ChatContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const {onlineUsers,socket,connectSocket} = useStore()
  console.log(onlineUsers);
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
  ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
  const senderId = location.state?.senderId;
  const receiverId = location.state?.receiverId;
  const userRole = location.state?.userRole;
  
  console.log("Location State:", location.state);
  const [receiverProfile, setReceiverProfile] = useState({
    name: 'John Doe', // Default placeholder name
    avatar: null, // Default avatar
    status: 'Offline', // Default status
  });

  useEffect(() => {
    if (receiverId) {
      const isOnline = onlineUsers.includes(receiverId);
      console.log(isOnline)
      setReceiverProfile((prevProfile) => ({
        ...prevProfile,
        status: isOnline ? 'Online' : 'Offline',
      }));
    }
  }, [onlineUsers, receiverId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))?.split('=')[1]; // Extract the token from cookies

      try {
        const response = await axios.get(
          `${apiUrl}/message/get/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );
        console.log('kya bhai:', response);
        setMessages(response.data); // Update the messages state with fetched messages
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    console.log("Receiver ID:", receiverId);
  
    if (receiverId) {
      fetchMessages();
    }
  }, [receiverId]);

  useEffect(() => {
    if(!socket)
      return;
    socket.onclose = () => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      setTimeout(connectSocket, 1000); // Retry connection after 1 second
    };
  },[socket])
  // Fetch receiver's profile on component mount
  useEffect(() => {
    const fetchReceiverProfile = async () => {
        const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))?.split('=')[1];

      try {
        const response = await axios.get(
          `${apiUrl}/user/getProfile/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );
        
        console.clear();
        console.log(response.data);
        // Update the receiver's profile state with the fetched data
        setReceiverProfile((prevProfile) => ({
          ...prevProfile,
          name: response.data.name || 'Unknown User',
          avatar: response.data.avatar || null,
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (receiverId) {
      fetchReceiverProfile();
    }
  }, [receiverId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
  
    const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  
    const messageObj = {
        text: newMessage,
        senderId, // Include sender ID
        receiverId, // Include receiver ID
        date: new Date(), // Add the current timestamp
      };

    try {
      // Send the message via the POST request to the backend
      const response = await axios.post(
        `${apiUrl}/message/send/${receiverId}`,
        messageObj, // Include `senderId` in the payload
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token for authentication
          },
        }
      );
      
  
      // Add the new message to the state (you can also handle socket updates here)
      setMessages([...messages, response.data]);
      setNewMessage('');  // Reset the message input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

 


  useEffect(() => {
    if (!socket) return; // Ensure the socket is available

    const handleNewMessage = (newMessage) => {
      
      // Only update the state if the new message is from the current receiver
      if (newMessage.senderId === receiverId) {
        console.log('kya be sender:', senderId);
        console.log('haa tumhi to ho message:', newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    // Subscribe to new message event
    socket.on('newMessage', handleNewMessage);

    // Cleanup on unmount or receiver change
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, receiverId, messages]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Chat Header */}
      <div className="bg-gray-800 p-4 flex items-center space-x-4 shadow-md">
        <button className="text-white hover:text-gray-300"
        onClick={()=>navigate(-1)}>
          <IoArrowBack />
        </button>

        <div className="flex items-center space-x-3">
          {receiverProfile.avatar ? (
            <img
              src={receiverProfile.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white" />
            </div>
          )}

          <div>
            <h2 className="text-white font-semibold">{receiverProfile.name}</h2>
            <p className="text-gray-400 text-sm">{receiverProfile.status}</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId === senderId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.senderId === senderId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {msg.text}
              <div className="text-xs text-gray-300 text-right mt-1">
              {msg.date || msg.createdAt
            ? new Date(msg.date || msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'No Date Available'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-gray-800 p-4 flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
        >
          <FaPaperPlane className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatContainer;
