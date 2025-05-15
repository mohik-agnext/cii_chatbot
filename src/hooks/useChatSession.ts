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
    if (!text) return '';
    
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

  // Function to generate a mock response based on the user's question
  const generateMockResponse = (userMessage: string): string => {
    const lowercasedMessage = userMessage.toLowerCase();
    
    // Generic response for SEZ policy questions
    if (lowercasedMessage.includes('sez') || lowercasedMessage.includes('special economic zone')) {
      return `Based on the Special Economic Zone (SEZ) Policy document:

Overview of SEZ Policy:
The SEZ Policy aims to promote export-oriented industries, attract foreign investment, and create employment opportunities.

Key Objectives:
1. Promote Export-Oriented Industries: To encourage growth of export-oriented industries like IT/ITES, electronics, and manufacturing.
2. Attract Foreign Investment: To create a favorable business environment for investors.
3. Create Employment Opportunities: To generate jobs for local populations.

Key Features:
1. Simplified Procedures: The policy provides simplified procedures for setting up SEZs.
2. Tax Incentives: Exemptions from certain taxes and duties to attract investors.
3. Infrastructure Support: Includes power, water, and transportation facilities.
4. Single-Window Clearance: A unified system to facilitate setting up of SEZs.`;
    }
    
    // Default response for other questions
    return `I'm sorry, I don't have specific information about "${userMessage}". 

Is there something specific about SEZ policies you'd like to know?`;
  };

  const sendMessage = async (userMessage: string) => {
    // Add user message to chat
    const newMessages: Message[] = [...messages, { from: 'user', text: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Set to false to use the webhook instead of mock responses
      const useMockResponse = false;
      console.log('Mock response setting:', useMockResponse ? 'ENABLED' : 'DISABLED');
      
      let responseText = '';
      
      if (useMockResponse) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        responseText = generateMockResponse(userMessage);
        console.log('Using mock response instead of webhook');
      } else {
        const res = await fetch(
          "https://mohik.app.n8n.cloud/webhook/policy",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Try the simplest format possible 
            body: JSON.stringify({ 
              message: userMessage
            }),
          }
        );
        
        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries([...res.headers.entries()]));
        
        if (!res.ok) {
          throw new Error("Error: " + res.status);
        }
        
        // Check Content-Length first
        const contentLength = res.headers.get('content-length');
        console.log('Content-Length:', contentLength);
        
        if (contentLength === '0') {
          console.log('Empty response detected (Content-Length: 0), falling back to mock response');
          // Use mock response instead of throwing an error
          responseText = generateMockResponse(userMessage) + "\n\n[Note: This is a mock response because the webhook returned an empty response. Check your n8n 'Respond to Webhook' node configuration.]";
        } else {
          // Try to parse as JSON first
          const contentType = res.headers.get('content-type');
          console.log('Content-Type:', contentType);
          
          try {
            if (contentType && contentType.includes('application/json')) {
              const rawText = await res.text();
              console.log('Raw response text:', rawText);
              
              // Only try to parse if there's actual content
              if (rawText && rawText.trim()) {
                const data = JSON.parse(rawText);
                console.log('JSON webhook response:', data);
                // Check various possible response fields
                responseText = data.text || data.response || data.result || data.output || data.message || data.answer || JSON.stringify(data);
              } else {
                console.log('Empty JSON response, using mock response');
                responseText = generateMockResponse(userMessage);
              }
            } else {
              // Handle as plain text
              responseText = await res.text();
              console.log('Text webhook response:', responseText);
              
              if (!responseText) {
                console.log('Empty text response, using mock response');
                responseText = generateMockResponse(userMessage);
              }
            }
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            responseText = generateMockResponse(userMessage);
          }
        }
      }
      
      // Format the response text for better readability
      const formattedText = formatResponseText(responseText);
      
      setMessages([
        ...newMessages,
        { 
          from: 'ai' as const, 
          text: formattedText
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
