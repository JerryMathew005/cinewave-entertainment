import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import aiService from '../services/aiService';

const INITIAL_SUGGESTIONS = [
  '🎬 What movies are now showing?',
  '📍 Where are your cinema theatres?',
  '🎟️ How do I book tickets & seats?',
  '🔑 How do I reset my password?'
];

const AiAssistant = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Welcome to CineWave Entertainment! I am your AI Cinema Concierge. Ask me anything about our movie catalogue, IMAX & Dolby screens, theatres, booking tickets, or your account.",
      suggestions: INITIAL_SUGGESTIONS,
      actions: [
        { label: 'Explore Movies', url: '/movies' },
        { label: 'Our Theatres', url: '/theatres' }
      ],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, messages]);

  const handleSend = async (queryText) => {
    const text = (queryText || inputMessage).trim();
    if (!text || loading) return;

    const userMsgId = 'user-' + Date.now();
    const newUserMsg = {
      id: userMsgId,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await aiService.sendMessage(text);
      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: res.reply || "I'm sorry, I couldn't process that request right now. Please try again.",
        suggestions: res.suggestions || [],
        actions: res.actions || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat error', err);
      const errorMsg = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: "I'm temporarily unable to connect to the assistant service. Please check your connection or explore our movies and showtimes using the top navigation bar.",
        suggestions: ['🎬 What movies are now showing?', '🔑 Forgot password help'],
        actions: [{ label: 'Explore Movies', url: '/movies' }],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (url) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
      setIsOpen(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'ai',
        text: "Chat refreshed! How may I assist you with your CineWave cinema experience today?",
        suggestions: INITIAL_SUGGESTIONS,
        actions: [
          { label: 'Explore Movies', url: '/movies' },
          { label: 'Our Theatres', url: '/theatres' }
        ],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Format markdown-like text (headers, bold, bullet points)
  const formatAiMessage = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} style={{ color: '#38BDF8', fontSize: '0.95rem', margin: '0.5rem 0 0.35rem', fontWeight: '700' }}>
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const bulletText = trimmed.substring(2);
        return (
          <div key={idx} style={{ display: 'flex', gap: '6px', margin: '3px 0', fontSize: '0.85rem' }}>
            <span style={{ color: '#38BDF8' }}>•</span>
            <span>{renderFormattedText(bulletText)}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <div key={idx} style={{ margin: '3px 0', fontSize: '0.85rem', paddingLeft: '4px' }}>
            {renderFormattedText(trimmed)}
          </div>
        );
      }
      if (trimmed === '') {
        return <div key={idx} style={{ height: '6px' }} />;
      }
      return (
        <p key={idx} style={{ margin: '3px 0', fontSize: '0.85rem', lineHeight: '1.45' }}>
          {renderFormattedText(trimmed)}
        </p>
      );
    });
  };

  const renderFormattedText = (text) => {
    // Process markdown bold **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#FFFFFF', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'inherit' }}>
      
      {/* Floating Action Button (Refined CineWave Theme) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="cinewave-ai-fab"
          aria-label="Open CineWave AI Assistant"
        >
          <div className="cinewave-ai-icon-wrap">
            <Sparkles size={17} color="#FFFFFF" />
            <span className="cinewave-ai-badge-dot" />
          </div>
          <span className="cinewave-ai-label">AI Assistant</span>
        </button>
      )}

      {/* Interactive Chat Window (Open State) */}
      {isOpen && (
        <div style={{
          width: isMinimized ? '300px' : '380px',
          height: isMinimized ? '58px' : '560px',
          maxHeight: 'calc(100vh - 48px)',
          maxWidth: 'calc(100vw - 32px)',
          backgroundColor: '#0A192F',
          borderRadius: '16px',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(14, 165, 233, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          
          {/* Header Bar */}
          <div style={{
            padding: '0.85rem 1rem',
            background: 'linear-gradient(90deg, #0F2744 0%, #061325 100%)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)'
              }}>
                <Sparkles size={18} color="#FFFFFF" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: '700', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  CineWave AI
                  <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                    Online
                  </span>
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Customer Concierge</span>
              </div>
            </div>

            {/* Header Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={handleResetChat}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}
                title="Restart conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area (Hidden if Minimized) */}
          {!isMinimized && (
            <>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                backgroundColor: '#061325'
              }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      width: '100%'
                    }}
                  >
                    <div style={{
                      maxWidth: '85%',
                      padding: '0.75rem 0.95rem',
                      borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      backgroundColor: msg.sender === 'user' ? '#0284C7' : '#0F2744',
                      color: '#FFFFFF',
                      border: msg.sender === 'user' ? 'none' : '1px solid rgba(56, 189, 248, 0.25)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                    }}>
                      {msg.sender === 'ai' ? formatAiMessage(msg.text) : <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>{msg.text}</p>}

                      {/* Action Links rendered by AI */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          {msg.actions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => handleActionClick(act.url)}
                              style={{
                                fontSize: '0.75rem',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                                color: '#38BDF8',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: '600',
                                transition: 'background-color 0.2s'
                              }}
                            >
                              {act.label} <ExternalLink size={11} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <span style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '3px', padding: '0 4px' }}>
                      {msg.time}
                    </span>

                    {/* Quick suggestion chips (on the latest AI message) */}
                    {msg.sender === 'ai' && msg.suggestions && msg.suggestions.length > 0 && msg.id === messages[messages.length - 1].id && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '0.5rem', width: '100%' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '500' }}>Suggested queries:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {msg.suggestions.map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(sug)}
                              style={{
                                fontSize: '0.75rem',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                backgroundColor: '#0F2744',
                                color: '#CBD5E1',
                                border: '1px solid rgba(56, 189, 248, 0.2)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(2, 132, 199, 0.25)';
                                e.currentTarget.style.color = '#38BDF8';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#0F2744';
                                e.currentTarget.style.color = '#CBD5E1';
                              }}
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontSize: '0.8rem', padding: '0.5rem' }}>
                    <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>CineWave AI is thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#0F2744',
                borderTop: '1px solid rgba(56, 189, 248, 0.2)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about movies, showtimes, seats..."
                  disabled={loading}
                  style={{
                    flex: 1,
                    backgroundColor: '#061325',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '20px',
                    padding: '0.5rem 1rem',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !inputMessage.trim()}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: inputMessage.trim() ? '#0284C7' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputMessage.trim() ? 'pointer' : 'default',
                    transition: 'background-color 0.2s'
                  }}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
};

export default AiAssistant;
