import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

function ChatRoom({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Conectar ao socket.io
    const newSocket = io("https://myfitness-pkft.onrender.com", {
      auth: { token: localStorage.getItem("token") },
    });

    setSocket(newSocket);

    newSocket.on("message", (message) => {
      if (message.conversationId === activeChat?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => newSocket.close();
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://myfitness-pkft.onrender.com/api/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://myfitness-pkft.onrender.com/api/chat/messages/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://myfitness-pkft.onrender.com/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: activeChat._id,
          text: newMessage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data]);
        setNewMessage("");
        
        // Emitir pelo socket
        socket?.emit("send-message", data);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const selectChat = (conversation) => {
    setActiveChat(conversation);
    fetchMessages(conversation._id);
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3>💬 Conversas</h3>
        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma conversa ainda</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={`conversation-item ${activeChat?._id === conv._id ? "active" : ""}`}
                onClick={() => selectChat(conv)}
              >
                <div className="conversation-avatar">
                  {conv.otherUser?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="conversation-info">
                  <h4>{conv.otherUser?.name || "Utilizador"}</h4>
                  <p className="last-message">{conv.lastMessage?.text || "Sem mensagens"}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="unread-badge">{conv.unreadCount}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-main">
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="chat-avatar">
                  {activeChat.otherUser?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{activeChat.otherUser?.name}</h3>
                  <span className="status online">● Online</span>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.senderId === user.id ? "sent" : "received"}`}
                >
                  <div className="message-content">
                    <p>{msg.text}</p>
                    <span className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString("pt-PT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Escreve uma mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="btn-primary">
                📤 Enviar
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <p>👋 Seleciona uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;
