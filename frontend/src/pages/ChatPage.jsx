import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_URL, request } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const ChatPage = () => {
  const { userId } = useParams();
  const { accessToken, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const data = await request(`/api/messages/${userId}`, {}, accessToken);
      setMessages(data.messages);
    };

    load();
  }, [accessToken, userId]);

  useEffect(() => {
    socketRef.current = io(API_URL, { auth: { token: accessToken } });
    socketRef.current.on('receive_message', (message) => {
      const isCurrentThread =
        (message.sender_id === Number(userId) && message.receiver_id === user.id) ||
        (message.sender_id === user.id && message.receiver_id === Number(userId));
      if (isCurrentThread) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socketRef.current.on('typing', ({ from }) => {
      if (Number(from) === Number(userId)) {
        setTyping(true);
        setTimeout(() => setTyping(false), 1200);
      }
    });

    return () => socketRef.current?.disconnect();
  }, [accessToken, user.id, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;

    const payload = { receiverId: Number(userId), content: content.trim() };
    socketRef.current.emit('send_message', payload);
    setContent('');
  };

  return (
    <div className="chat-page">
      <header>
        <Link to="/users">← Back</Link>
        <h3>Chat with user #{userId}</h3>
      </header>
      <div className="chat-box">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender_id === user.id ? 'sent' : 'received'}`}>
            {message.content}
          </div>
        ))}
        {typing && <p className="muted">Typing...</p>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="composer">
        <input
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            socketRef.current.emit('typing', { receiverId: Number(userId) });
          }}
          placeholder="Write a message..."
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
