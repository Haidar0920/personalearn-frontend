import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import Icon from '../components/Icon.tsx';
import Button from '../components/Button.tsx';
import { aiApi, type ChatMessage } from '../api/ai';
import { employeesApi } from '../api/employees';

interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIHelper() {
  const [searchParams] = useSearchParams();
  const materialId = searchParams.get('materialId') ?? undefined;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await employeesApi.me();
        setEmployeeId(me.id);

        const history = await aiApi.history(
          me.id,
          materialId,
          materialId ? 'employee_chat' : 'employee_chat'
        );
        const mapped: UIMessage[] = history.map((m: ChatMessage) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        }));
        setMessages(mapped);
      } catch {
        // Not linked yet or error - show empty chat
      } finally {
        setLoadingHistory(false);
      }
    };
    init();
  }, [materialId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async () => {
    const text = message.trim();
    if (!text || sending || !employeeId) return;

    setMessage('');
    const tempId = `tmp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: tempId, role: 'user', content: text }]);
    setSending(true);

    try {
      const reply = await aiApi.chat({
        employeeId,
        materialId,
        message: text,
        chatType: materialId ? 'employee_chat' : 'employee_chat',
      });
      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: 'assistant', content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Произошла ошибка. Попробуйте ещё раз.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PersonaLearnLayout>
      <div className="text-center">
        <div className="px-8 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 text-lg font-bold">AI помощник</h2>
            <p className="text-sm text-slate-500">
              Поддержка сотрудника по вопросам из базы знаний и библиотеке материалов
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-500">AI помощник активен</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[400px]">
          {loadingHistory ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <div className="text-center">
                <Icon name="smart_toy" className="text-5xl mb-3 text-blue-300" />
                <p className="font-medium">Задайте первый вопрос AI помощнику</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 max-w-2xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {msg.role === 'assistant' ? (
                  <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <Icon name="smart_toy" className="text-blue-500" />
                  </div>
                ) : (
                  <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                    <div
                      className="w-full h-full bg-center bg-cover"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCaAiyXGGhXDUPgndkeam3hbF7HB454ZYxGVcGiH6K-_l40b0xUckgnAs1MDS2Cd7SjilARVkTJavAO49GiHYnDec3-Ov80isyk70DSoEraImkxeA1ubQ_dexaqkK5GHy4nFPmYDkth0UGbZ6f-fIXKkkordutdQzuiRLZcVlZYbHZqIGBz0eHudCx4k7ZFRJk2A_i8KOZtC9u7mdsMYlUvn3eeBqRBZHpn9MVkf8YV1KpLPu0vEf53KtTWfIl_BFuusnevvx8IWHY")',
                      }}
                    />
                  </div>
                )}
                <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                    {msg.role === 'assistant' ? 'AI помощник' : 'Вы'}
                  </p>
                  <div
                    className={`p-4 rounded-xl shadow-sm ${
                      msg.role === 'assistant'
                        ? 'bg-white border border-slate-200 rounded-tl-none'
                        : 'bg-blue-500 text-white rounded-tr-none shadow-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line text-left">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {sending && (
            <div className="flex items-start gap-3 max-w-2xl">
              <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Icon name="smart_toy" className="text-blue-500" />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl rounded-tl-none p-4 shadow-sm">
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

        <div className="p-6 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <textarea
                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 pr-12 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                placeholder="Задайте вопрос по материалам, базе знаний или рабочей ситуации..."
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending || !employeeId}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500">
                <Icon name="mic" />
              </button>
            </div>
            <Button
              icon="send"
              iconPosition="right"
              className="px-6 py-3"
              onClick={handleSend}
            >
              Отправить
            </Button>
          </div>
        </div>
      </div>
    </PersonaLearnLayout>
  );
}
