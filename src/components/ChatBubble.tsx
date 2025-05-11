import React from 'react';

interface ChatBubbleProps {
  message: {
    from: 'user' | 'ai';
    text: string;
  };
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.from === 'user';
  
  // Function to render text with line breaks
  const renderTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 message-enter`}>
      <div 
        className={`px-4 py-3 rounded-2xl max-w-[80%] shadow-sm ${
          isUser 
            ? 'bg-gradient-to-r from-violet-400 to-fuchsia-400 text-white' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 border border-purple-100'
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">
          {renderTextWithLineBreaks(message.text)}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
