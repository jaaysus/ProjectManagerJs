import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, removeToken, removeUserData } from "../utils/auth";
import { socket } from "../utils/socket";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userData) {
      navigate("/");
      return;
    }

    if (userData?.id) {
      socket.emit("join", { userId: userData.id });
    }

    const handlePreviousMessages = (messages) => {
      setMessages(messages);
    };

    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("receive_message", handleMessage);
    socket.on("previous_messages", handlePreviousMessages);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("previous_messages", handlePreviousMessages);
    };
  }, [userData, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = () => {
    removeToken();
    removeUserData();
    navigate("/auth");
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("send_message", {
        username: userData.username,
        text: newMessage,
        timestamp: new Date(),
      });

      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="container">
      {/* User Info & Logout */}
      <div className="user-info">
        <div className="user-details">
          <h2>Welcome, {userData?.username}</h2>
          <p className="email">{userData?.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Chat Section */}
      <div className="chat-container">
        <h3>Live Chat</h3>

        {/* Messages */}
        <div className="chat-box">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.username === userData.username ? "sent" : "received"
              }`}
            >
              <strong>{message.username}:</strong> {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Send */}
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress} // Handle "Enter" key
            placeholder="Type your message..."
            className="input-field"
          />
          <button onClick={handleSendMessage} className="send-btn">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
