import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
  
    const socket = io('http://localhost:6969'); // Replace with your server URL
  
    useEffect(() => {
      socket.on('chat message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
  
      return () => {
        socket.off('chat message');
      };
    }, []);
  
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (inputValue.trim() !== '') {
        socket.emit('chat message', inputValue);
        setInputValue('');
      }
    };
  
    return (
      <div>
        <div>
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  };
  
  export default ChatBox;
  