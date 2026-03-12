import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import examData from "../data/aiKnowledgeCheck.json";
import Icon from "../components/Icon.tsx";
import Button from "../components/Button.tsx";
import {useState} from "react";

export default function AIHelper() {

    const [message, setMessage] = useState('');

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

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {examData.messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-start gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                        >
                            {msg.sender === 'ai' ? (
                                <div
                                    className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                                    <Icon name="smart_toy" className="text-blue-500"/>
                                </div>
                            ) : (
                                <div
                                    className="size-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                                    <div
                                        className="w-full h-full bg-center bg-cover"
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCaAiyXGGhXDUPgndkeam3hbF7HB454ZYxGVcGiH6K-_l40b0xUckgnAs1MDS2Cd7SjilARVkTJavAO49GiHYnDec3-Ov80isyk70DSoEraImkxeA1ubQ_dexaqkK5GHy4nFPmYDkth0UGbZ6f-fIXKkkordutdQzuiRLZcVlZYbHZqIGBz0eHudCx4k7ZFRJk2A_i8KOZtC9u7mdsMYlUvn3eeBqRBZHpn9MVkf8YV1KpLPu0vEf53KtTWfIl_BFuusnevvx8IWHY")',
                                        }}
                                    />
                                </div>
                            )}
                            <div className={`flex flex-col gap-1.5 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                                    {msg.sender === 'ai' ? 'AI помощник' : 'Вы'}
                                </p>
                                <div
                                    className={`p-4 rounded-xl shadow-sm ${
                                        msg.sender === 'ai'
                                            ? 'bg-white border border-slate-200 rounded-tl-none'
                                            : 'bg-blue-500 text-white rounded-tr-none shadow-md'
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
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
            />
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500">
                                <Icon name="mic"/>
                            </button>
                        </div>
                        <Button
                            icon="send"
                            iconPosition="right"
                            className="px-6 py-3"
                            onClick={() => {
                                if (message.trim()) {
                                    setMessage('');
                                }
                            }}
                        >
                            Отправить
                        </Button>
                    </div>
                </div>
            </div>
        </PersonaLearnLayout>
    );
}
