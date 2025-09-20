
import React, { useState, useRef, useEffect } from 'react';
import type { User, ChatThread } from '../types';
import { SendIcon } from './Icons';

interface ChatWindowProps {
  currentUser: User;
  receiver: User;
  chatThread?: ChatThread;
  onSendMessage: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, chatThread, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatThread?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg">
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {chatThread?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                msg.senderId === currentUser.id
                  ? 'bg-riceBlue text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-2 border-t flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow bg-transparent border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-riceBlue"
        />
        <button type="submit" className="ml-2 p-2 text-riceBlue rounded-full hover:bg-blue-100 focus:outline-none">
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
