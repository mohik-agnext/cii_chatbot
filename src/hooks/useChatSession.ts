import { useState } from 'react';

interface Message {
  from: 'user' | 'ai';
  text: string;
}

export const useChatSession = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to format text with proper line breaks and styling
  const formatResponseText = (text: string): string => {
    // Replace markdown-style bold with proper formatting
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Add line breaks for numbered lists (1., 2., etc.)
    formatted = formatted.replace(/(\d+\.\s+.*?)(?=\s*\d+\.|$)/g, '$1\n\n');
    
    // Add line breaks for headings (some text followed by a colon)
    formatted = formatted.replace(/([^:\n]+):\s+/g, '\n$1: ');
    
    // Handle paragraph breaks
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    return formatted.trim();
  };

  const sendMessage = async (userMessage: string) => {
    // Add user message to chat
    const newMessages: Message[] = [...messages, { from: 'user', text: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Set to false to use mock responses for testing
      const useMockResponse = false;
      
      let data;
      let responseText = '';
      
      if (useMockResponse) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        responseText = "This is a mock response to: " + userMessage;
      } else {
        const res = await fetch(
          "https://mohikagnext.app.n8n.cloud/webhook/question",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
          }
        );
        
        if (!res.ok) {
          throw new Error("Error: " + res.status);
        }
        
        // Try to parse as JSON first
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
          console.log('JSON webhook response:', data);
          responseText = data.myField || data.text || data.response || '';
        } else {
          // Handle as plain text
          responseText = await res.text();
          console.log('Text webhook response:', responseText);
        }
      }
      
      // Format the response text for better readability
      const formattedText = formatResponseText(responseText);
      
      setMessages([
        ...newMessages,
        { 
          from: 'ai' as const, 
          text: formattedText || 'Sorry, I couldn\'t process that request.'
        }
      ]);
    } catch (err) {
      console.error('Error fetching response:', err);
      setMessages([
        ...newMessages,
        { 
          from: 'ai' as const, 
          text: 'Sorry, something went wrong with the connection. Please try again.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};
