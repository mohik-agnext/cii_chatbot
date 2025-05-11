
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-3 message-enter">
      <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-100 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
