import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  Home,
  Users,
  Loader2,
  RotateCcw,
  Copy,
  Check,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react'
import { askGemma } from '../gemma'

const SUGGESTED_QUESTIONS = [
  {
    topic: 'Renting',
    icon: Home,
    question: 'What are the red flags to look out for when renting a student room?',
  },
  {
    topic: 'Roommates',
    icon: Users,
    question: 'How do I split chores and expenses fairly with a new flatmate?',
  },
  {
    topic: 'Textbooks',
    icon: BookOpen,
    question: 'Can I use an older edition of an engineering or math textbook?',
  },
  {
    topic: 'Deposits',
    icon: ShieldCheck,
    question: 'How much security deposit is reasonable for a shared student flat?',
  },
]

export default function GemmaAssistant() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'gemma',
      text:
        "Hi! I'm Gemma, your CampusLoop AI advisor. Ask me anything about finding rooms, budgeting rent, roommate compatibility, or sharing used textbooks on campus!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [copiedId, setCopiedId] = useState(null)
  const [error, setError] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(questionText) {
    const textToSend = (questionText || input).trim()
    if (!textToSend || loading) return

    setError('')
    setInput('')

    const userMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await askGemma(textToSend)
      const gemmaMessage = {
        id: 'gemma-' + Date.now(),
        sender: 'gemma',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, gemmaMessage])
    } catch (err) {
      console.error('Error asking Gemma:', err)
      setError(err.message || 'Something went wrong while asking Gemma. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function copyToClipboard(id, text) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleReset() {
    setMessages([
      {
        id: 'welcome',
        sender: 'gemma',
        text:
          "Hi! I'm Gemma, your CampusLoop AI advisor. Ask me anything about finding rooms, budgeting rent, roommate compatibility, or sharing used textbooks on campus!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setError('')
    setInput('')
  }

  return (
    <div className="gemma-assistant-container">
      {/* Assistant Header */}
      <div className="gemma-header">
        <div className="gemma-branding">
          <div className="gemma-avatar">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="gemma-title-row">
              <h3>Gemma AI Assistant</h3>
              <span className="gemma-badge">Campus AI</span>
            </div>
            <p className="gemma-subtitle">
              Get instant student guidance on renting, flatmates, and BookLoop textbooks.
            </p>
          </div>
        </div>

        <button
          className="btn btn-outline btn-small"
          onClick={handleReset}
          title="Reset conversation"
          aria-label="Reset conversation"
        >
          <RotateCcw size={14} /> New Chat
        </button>
      </div>

      {/* Suggested Quick Starters */}
      <div className="gemma-suggestions">
        <div className="suggestions-label">
          <HelpCircle size={13} /> Popular questions:
        </div>
        <div className="suggestions-grid">
          {SUGGESTED_QUESTIONS.map(({ topic, icon: Icon, question }) => (
            <button
              key={topic}
              className="suggestion-chip"
              onClick={() => handleSend(question)}
              disabled={loading}
            >
              <Icon size={14} className="chip-icon" />
              <span>{question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Screen */}
      <div className="gemma-chat-window">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`gemma-message-row ${msg.sender === 'user' ? 'user-row' : 'gemma-row'}`}
          >
            <div className={`message-avatar ${msg.sender}`}>
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={`message-bubble ${msg.sender}`}>
              <div className="message-header">
                <strong>{msg.sender === 'user' ? 'You' : 'Gemma'}</strong>
                <span className="message-time">{msg.timestamp}</span>
              </div>

              <div className="message-content">
                {msg.text.split('\n').map((line, idx) => {
                  if (!line.trim()) {
                    return <div key={idx} className="message-spacer" />
                  }
                  return (
                    <p key={idx} className="message-paragraph">
                      {line}
                    </p>
                  )
                })}
              </div>

              {msg.sender === 'gemma' && msg.id !== 'welcome' && (
                <div className="message-actions">
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(msg.id, msg.text)}
                    aria-label="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check size={12} className="copied-icon" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy advice
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="gemma-message-row gemma-row">
            <div className="message-avatar gemma">
              <Bot size={16} />
            </div>
            <div className="message-bubble gemma loading-bubble">
              <div className="loading-content">
                <Loader2 size={16} className="spinning" />
                <span>Gemma is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {error && <div className="gemma-error">{error}</div>}

      {/* Input Form */}
      <form
        className="gemma-input-form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Gemma about leases, roommates, or finding textbooks..."
          disabled={loading}
          className="gemma-input"
        />
        <button
          type="submit"
          className="btn btn-dark gemma-send-btn"
          disabled={loading || !input.trim()}
          aria-label="Send question"
        >
          {loading ? <Loader2 size={16} className="spinning" /> : <Send size={16} />}
          <span>Ask</span>
        </button>
      </form>
    </div>
  )
}
