
import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface InputBoxProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 bg-white border-t p-4">
      <div className="relative flex-grow">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Cii something..."
          className="w-full p-4 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none min-h-[56px] max-h-32"
          rows={1}
          disabled={disabled}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`p-3 rounded-full ${
          !message.trim() || disabled 
            ? 'bg-gray-200 text-gray-500' 
            : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md hover:shadow-lg transition-all'
        }`}
      >
        <Send size={20} className={disabled ? 'opacity-50' : ''} />
      </button>
    </form>
  );
};

export default InputBox;
