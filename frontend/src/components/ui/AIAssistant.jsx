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
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
        {/* Chat Panel */}
        {open && (
          <div className="bg-white rounded-2xl shadow-2xl mb-4 w-[350px] max-w-[calc(100vw-48px)] overflow-hidden flex flex-col h-[500px] max-h-[70vh] border border-slate-200 animate-[fadeIn_0.2s_ease]">
            {/* Header */}
            <div className="bg-[#0a8c24] text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">🤖</span>
                <div>
                  <div className="text-[14px] font-semibold">Trợ lý AI Hội Nông Dân</div>
                  <div className="text-[11px] opacity-80 font-normal">
                    {aiAvailable ? '🟢 Đang hoạt động' : '🔴 Chưa cấu hình'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={clearChat}
                  title="Xóa lịch sử chat"
                  className="bg-white/15 border-none text-white rounded-md px-2 py-1 text-[12px] cursor-pointer hover:bg-white/25 transition-colors"
                >
                  🗑️
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-white/15 border-none text-white rounded-md px-[10px] py-1 text-[16px] cursor-pointer hover:bg-white/25 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl max-w-[85%] text-[14px] shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#0a8c24] text-white self-end rounded-br-sm'
                      : 'bg-white text-slate-800 self-start border border-slate-200 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="p-3 rounded-2xl max-w-[85%] text-[14px] shadow-sm bg-white text-slate-800 self-start border border-slate-200 rounded-bl-sm">
                  <span>🤖 Đang phân tích</span>
                  <span className="animate-pulse">...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center shrink-0">
              <input
                type="text"
                className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-[14px] outline-none focus:border-[#0a8c24] transition-colors"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về dữ liệu phản ánh..."
                disabled={loading}
              />
              <button
                className="bg-[#0a8c24] hover:bg-[#07701c] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full w-[38px] h-[38px] flex items-center justify-center shrink-0 shadow-sm transition-colors"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>

            {/* Quick questions */}
            <div className="px-3 pb-3 bg-white flex gap-2 flex-wrap shrink-0">
              {[
                'Tổng quan hôm nay',
                'Lĩnh vực nhiều nhất',
                'Ưu tiên cao cần xử lý',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-[11px] px-2 py-1 rounded-full border border-[#c6e4cc] bg-[#eaf8ec] text-[#087c20] cursor-pointer font-semibold hover:bg-[#d6f2da] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAB Button (Drag Handle) */}
        <button
          className="ai-fab-btn w-[56px] h-[56px] rounded-full bg-[#0a8c24] text-white flex items-center justify-center text-[24px] shadow-lg hover:bg-[#087c20] transition-colors shadow-[0_4px_12px_rgba(10,140,36,0.3)]"
          title="Trợ lý AI Hội Nông Dân"
          style={{ cursor: 'move', touchAction: 'none' }}
        >
          {open ? '×' : '🤖'}
        </button>

        {/* Dismiss widget button */}
        {!open && (
          <button
            className="absolute -top-1 -right-1 w-[22px] h-[22px] rounded-full bg-red-500 text-white border-2 border-white flex items-center justify-center cursor-pointer shadow-sm z-[10000] hover:bg-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            title="Ẩn chatbot"
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
