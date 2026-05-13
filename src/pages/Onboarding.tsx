import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiApi } from '../api/ai';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const TOTAL_QUESTIONS = 7;

export default function Onboarding() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [learningProfile, setLearningProfile] = useState('');
  const [userMessageCount, setUserMessageCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  const nextId = () => {
    idCounter.current += 1;
    return idCounter.current;
  };

  useEffect(() => {
    // Send initial "start" message to get the greeting
    const init = async () => {
      setLoading(true);
      try {
        const res = await aiApi.onboarding('start');
        setMessages([{ id: nextId(), role: 'assistant', content: res.reply }]);
        if (res.completed) {
          setCompleted(true);
          setLearningProfile(res.learningProfile);
        }
      } catch {
        setMessages([
          {
            id: nextId(),
            role: 'assistant',
            content: 'Привет! Давайте начнём знакомство. Расскажите немного о себе.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg: Message = { id: nextId(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setUserMessageCount((c) => c + 1);
    setLoading(true);

    try {
      const res = await aiApi.onboarding(text);
      const aiMsg: Message = { id: nextId(), role: 'assistant', content: res.reply };
      setMessages((prev) => [...prev, aiMsg]);
      if (res.completed) {
        setCompleted(true);
        setLearningProfile(res.learningProfile);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', content: 'Произошла ошибка. Попробуйте ещё раз.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const progress = Math.min((userMessageCount / TOTAL_QUESTIONS) * 100, 100);

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-emerald-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-emerald-600">
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>

          <div>
            <h1 className="text-[30px] font-black text-slate-900 tracking-[-0.02em]">
              Профиль готов!
            </h1>
            <p className="mt-3 text-[16px] text-slate-500 leading-relaxed">
              Ваш стиль обучения:{' '}
              <span className="font-bold text-blue-600">{learningProfile}</span>
            </p>
            <p className="mt-2 text-[14px] text-slate-400">
              Теперь AI будет подстраивать материалы под ваш стиль.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full h-14 rounded-[16px] bg-blue-600 text-white text-[16px] font-bold shadow-[0_8px_14px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition"
          >
            Начать обучение
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 shadow-md">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-[18px] font-bold tracking-tight">PersonaLearn</span>
          </div>
          <h1 className="text-[22px] font-black tracking-[-0.02em]">Знакомство с вами</h1>
          <p className="text-[14px] text-blue-100 mt-1">
            Ответьте на несколько вопросов, чтобы AI мог настроить обучение
          </p>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[12px] text-blue-200 font-medium">
                Вопрос {Math.min(userMessageCount + 1, TOTAL_QUESTIONS)} из {TOTAL_QUESTIONS}
              </span>
              <span className="text-[12px] text-blue-200 font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-blue-500 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/70 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'assistant' ? (
                <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                  </svg>
                </div>
              ) : (
                <div className="size-9 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-[13px] font-bold text-slate-600">
                  Вы
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    : 'bg-blue-600 text-white rounded-tr-none shadow-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                </svg>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <textarea
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[15px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
            placeholder="Напишите ваш ответ..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="h-12 px-5 rounded-xl bg-blue-600 text-white font-bold text-[15px] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
