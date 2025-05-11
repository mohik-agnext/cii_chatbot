
import React from 'react';
import ChatWindow from '../components/ChatWindow';
import InputBox from '../components/InputBox';
import { useChatSession } from '../hooks/useChatSession';

const Index = () => {
  const { messages, sendMessage, loading } = useChatSession();

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-white border-b px-4 py-3 shadow-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">Cii Chat</h1>
      </header>
      
      <ChatWindow 
        messages={messages}
        loading={loading}
      />
      
      <InputBox 
        onSend={sendMessage}
        disabled={loading}
      />
    </div>
  );
};

export default Index;
