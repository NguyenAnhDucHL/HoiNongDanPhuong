import React, { useState, useRef, useEffect } from 'react';
import { fetchApi } from '../../lib/api';

const PublicChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Chào bạn, tôi là trợ lý ảo của Hội Nông Dân Phường. Tôi có thể giúp gì cho bạn?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the public AI endpoint
      const response = await fetchApi('/ai/chat/public', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage })
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: '#ff8a00',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 15px rgba(255, 138, 0, 0.3)',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'scale(0)' : 'scale(1)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {/* Chat Window */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 350,
          height: 500,
          backgroundColor: 'white',
          borderRadius: 16,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <div style={{
          backgroundColor: '#ff8a00',
          color: 'white',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff8a00', fontWeight: 'bold' }}>
              AI
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Trợ lý AI</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Hội Nông Dân Phường</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 8,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12 }}>
                  🤖
                </div>
              )}
              <div style={{
                backgroundColor: msg.role === 'user' ? '#ff8a00' : 'white',
                color: msg.role === 'user' ? 'white' : '#334155',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                fontSize: 14,
                lineHeight: 1.5,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-start' }}>
               <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12 }}>
                  🤖
                </div>
              <div style={{
                backgroundColor: 'white',
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 0',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                display: 'flex',
                gap: 4
              }}>
                <span className="dot-typing" style={{ fontSize: 14, color: '#94a3b8' }}>Đang gõ...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: 16, borderTop: '1px solid #e2e8f0', backgroundColor: 'white' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            borderRadius: 24,
            padding: '4px 4px 4px 16px'
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi tôi bất cứ điều gì..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 14,
                color: '#334155'
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: input.trim() ? '#ff8a00' : '#cbd5e1',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicChatbot;
