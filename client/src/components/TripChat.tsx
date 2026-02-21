import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, X, Minimize2 } from 'lucide-react';
import api from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TripChatProps {
  tripId: string;
  destination: string;
}

const TripChat = ({ tripId, destination }: TripChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.chatWithConcierge({
        tripId,
        message: text,
        history: messages,
      });
      const assistantMsg: Message = {
        role: 'assistant',
        content: response.data.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all z-50"
        title="Chat with AI Concierge"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50" style={{ maxHeight: '70vh' }}>
      {/* Header */}
      <div className="bg-primary-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
        <div>
          <p className="font-semibold text-sm">AI Concierge</p>
          <p className="text-xs opacity-80">{destination}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-primary-500 rounded">
            <Minimize2 size={16} />
          </button>
          <button
            onClick={() => { setIsOpen(false); setMessages([]); }}
            className="p-1 hover:bg-primary-500 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: '200px', maxHeight: '50vh' }}>
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            <MessageCircle className="mx-auto mb-2 text-gray-300" size={32} />
            <p>Ask me anything about your trip!</p>
            <div className="mt-3 space-y-1">
              {['Best local food to try?', 'What should I pack?', 'Money-saving tips?'].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="block w-full text-xs text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your trip..."
            className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-primary-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripChat;
