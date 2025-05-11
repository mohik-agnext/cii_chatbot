
import React, { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';

interface Message {
  from: 'user' | 'ai';
  text: string;
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, loading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">Welcome to Cii Chat!</h2>
          <p className="text-gray-600 mb-6">Ask me anything about your data or just start a conversation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-purple-50 to-white">
      {messages.map((message, index) => (
        <ChatBubble key={index} message={message} />
      ))}
      {loading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
