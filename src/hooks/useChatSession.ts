
import { useState } from 'react';

interface Message {
  from: 'user' | 'ai';
  text: string;
}

export const useChatSession = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userMessage: string) => {
    // Add user message to chat
    const newMessages = [...messages, { from: 'user', text: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const encodedMessage = encodeURIComponent(userMessage);
      const res = await fetch(
        `https://mohikagnext.app.n8n.cloud/webhook/14a2ee13-349e-40e0-9fa7-5af217461fa0/${encodedMessage}`
      );
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      
      const data = await res.json();
      
      setMessages([
        ...newMessages,
        { 
          from: 'ai', 
          text: data.text || 'Sorry, I couldn\'t process that request.'
        }
      ]);
    } catch (err) {
      console.error('Error fetching response:', err);
      setMessages([
        ...newMessages,
        { 
          from: 'ai', 
          text: 'Sorry, something went wrong with the connection. Please try again.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};
