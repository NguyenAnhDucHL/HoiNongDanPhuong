import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { fetchApi } from '../../lib/api';

const WELCOME_MSG = {
  role: 'assistant',
  content: '🌿 Xin chào! Tôi là trợ lý AI của Hội Nông Dân Phường Cẩm Phả. Tôi có thể giúp bạn:\n• Phân tích dữ liệu phản ánh\n• Thống kê theo lĩnh vực/khu phố\n• Gợi ý ưu tiên xử lý\n\nHãy đặt câu hỏi cho tôi!',
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);
  const messagesEndRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (open) {
      checkAIStatus();
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkAIStatus = async () => {
    try {
      const res = await fetchApi('/ai/status');
      setAiAvailable(res.available);
      if (!res.available) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ ' + res.message,
        }]);
      }
    } catch (e) {
      console.error('AI status check failed:', e);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetchApi('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Lỗi: ${e.message}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MSG]);
  };

  if (!isVisible) return null;

  return (
    <Draggable
      bounds="body"
      handle=".ai-fab-btn"
      onStart={(e, data) => {
        dragStartPos.current = { x: data.x, y: data.y };
      }}
      onStop={(e, data) => {
        const dx = Math.abs(data.x - dragStartPos.current.x);
        const dy = Math.abs(data.y - dragStartPos.current.y);
        // If it barely moved, it's a click
        if (dx < 5 && dy < 5) {
          setOpen(!open);
        }
      }}
    >
      <div className="ai-fab">
        {/* Chat Panel */}
        {open && (
          <div className="ai-chat-panel">
            {/* Header */}
            <div className="ai-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <div>
                  <div style={{ fontSize: 14 }}>Trợ lý AI Hội Nông Dân</div>
                  <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 400 }}>
                    {aiAvailable ? '🟢 Đang hoạt động' : '🔴 Chưa cấu hình'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  onClick={clearChat}
                  title="Xóa lịch sử chat"
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}
                >
                  🗑️
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 16, cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="ai-chat-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`ai-msg ${msg.role === 'user' ? 'user' : 'assistant'}`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="ai-msg loading">
                  <span>🤖 Đang phân tích</span>
                  <span style={{ animation: 'blink 1s infinite' }}>...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="ai-chat-input">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về dữ liệu phản ánh..."
                disabled={loading}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{ borderRadius: '50%', width: 38, height: 38, padding: 0, flexShrink: 0 }}
              >
                →
              </button>
            </div>

            {/* Quick questions */}
            <div style={{ padding: '0 12px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                'Tổng quan hôm nay',
                'Lĩnh vực nhiều nhất',
                'Ưu tiên cao cần xử lý',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  style={{
                    fontSize: 11, padding: '4px 8px', borderRadius: 999,
                    border: '1px solid #dce8df', background: '#eaf8ec',
                    color: '#087c20', cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAB Button (Drag Handle) */}
        <button
          className="ai-fab-btn"
          title="Trợ lý AI Hội Nông Dân"
          style={{ cursor: 'move', touchAction: 'none' }}
        >
          {open ? '×' : '🤖'}
        </button>

        {/* Dismiss widget button */}
        {!open && (
          <button
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            title="Ẩn chatbot"
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              color: 'white',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              zIndex: 10000,
              padding: 0
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </Draggable>
  );
}
