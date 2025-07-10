"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'chat'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('chat_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
      setStep('chat');
      const savedMessages = localStorage.getItem('chat_messages');
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.error("Error parsing chat messages from local storage", e);
        }
      }
    }
  }, []);
  
  useEffect(() => {
    if (messages.length > 0 && step === 'chat') {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, step]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      name: userEmail, // Use email as name
      email: userEmail,
      message: input,
      source: 'ChatWidget',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMessage),
      });
    } catch (error) {
      console.error("Chat widget error:", error);
    }
    
    setInput('');
  };
  
  const handleStartChat = (e) => {
    e.preventDefault();
    if (userEmail.trim()) {
        localStorage.setItem('chat_user_email', userEmail);
        setStep('chat');
    }
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="w-[90vw] max-w-sm h-[70vh] max-h-[500px] sm:w-80 sm:h-96 bg-[#1A1A1A] border border-[#333333] rounded-lg flex flex-col shadow-2xl">
          <div className="p-4 bg-[#121212] rounded-t-lg">
            <h3 className="font-bold text-white text-lg">Chat with us</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {step === 'chat' && messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.source === 'AdminReply' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${msg.source === 'AdminReply' ? 'bg-[#003333]' : 'bg-[#005555]'}`}>
                  <p className="text-white text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
             <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-[#333333]">
            {step === 'email' && (
              <form onSubmit={handleStartChat}>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 py-2 bg-[#121212] border border-[#333333] rounded-md focus:outline-none text-white"
                  required
                />
                <button type="submit" className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md">
                  Start Chat
                </button>
              </form>
            )}
            {step === 'chat' && (
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-[#121212] border border-[#333333] rounded-md focus:outline-none text-white"
                    />
                    <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md">
                    Send
                    </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] rounded-full flex items-center justify-center text-black shadow-lg hover:opacity-90 transition-opacity"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
      </button>
    </div>
  );
} 