import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { login } from '../api/auth';
import { getUserRole } from '../lib/supabase';
import {toast, ToastContainer} from "react-toastify";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [_loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            const role = await getUserRole();
            // Redirect based on role
            if (role === 'client_admin') {
                navigate('/');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error((err as Error).message || 'Неверный email или пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light min-h-screen font-display">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex min-h-screen w-full">
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-blue-500 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-white">
                            <div className="size-8">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        clipRule="evenodd"
                                        d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">PersonaLearn</span>
                        </div>
                    </div>
                    <div className="relative z-10 max-w-lg">
                        <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
                            Повышайте эффективность продаж с помощью обучения на базе ИИ
                        </h1>
                        <p className="text-white/80 text-lg font-normal leading-relaxed">
                            B2B SaaS платформа для тренировки персонала с использованием диалоговых ИИ-моделей и интеллектуального отслеживания прогресса.
                        </p>
                    </div>
                    <div className="relative z-10">
                        <div className="flex gap-4">
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                                <Icon name="trending_up" className="text-white mb-2" />
                                <p className="text-white text-sm font-medium">+40% к конверсии</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                                <Icon name="psychology" className="text-white mb-2" />
                                <p className="text-white text-sm font-medium">ИИ-симуляции</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-black/10 rounded-full blur-2xl"></div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-20 bg-background-light">
                    <div className="w-full max-w-[440px]">
                        <div className="mb-10">
                            <div className="lg:hidden flex items-center gap-2 mb-8 text-blue-500">
                                <div className="size-6">
                                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            clipRule="evenodd"
                                            d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold">AI Training</span>
                            </div>
                            <h2 className="text-[#111418] text-3xl font-bold leading-tight tracking-[-0.015em] mb-2">
                                Вход в систему
                            </h2>
                            <p className="text-[#617289] text-base">Добро пожаловать! Пожалуйста, введите ваши данные.</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="flex flex-col">
                  <span className="text-[#111418] text-sm font-semibold leading-normal pb-2">
                    Email
                  </span>
                                    <input
                                        className="form-input flex w-full rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-14 placeholder:text-[#617289] px-4 text-base font-normal transition-all"
                                        placeholder="you@company.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-[#111418] text-sm font-semibold leading-normal">Пароль</span>
                                    <a className="text-blue-500 text-sm font-semibold hover:underline" href="#">
                                        Забыли пароль?
                                    </a>
                                </div>
                                <div className="relative flex w-full items-stretch rounded-lg group">
                                    <input
                                        className="form-input flex w-full rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-14 placeholder:text-[#617289] px-4 pr-12 text-base font-normal transition-all"
                                        placeholder="••••••••"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#617289] hover:text-blue-500 transition-colors"
                                    >
                                        <Icon name={showPassword ? 'visibility_off' : 'visibility'} />
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-14" icon="login" iconPosition="right">
                                Войти в аккаунт
                            </Button>
                        </form>
                        {/*<div className="mt-8 pt-8 border-t border-[#f0f2f4]">*/}
                        {/*    <button*/}
                        {/*        type="button"*/}
                        {/*        onClick={() => navigate('/dashboard-manager')}*/}
                        {/*        className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-[#dbe0e6] rounded-lg text-[#111418] text-sm font-semibold hover:bg-gray-50 transition-colors"*/}
                        {/*    >*/}
                        {/*        <svg className="w-5 h-5" viewBox="0 0 24 24">*/}
                        {/*            /!* Google Icon *!/*/}
                        {/*        </svg>*/}
                        {/*        Войти через Google*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                        <p className="mt-8 text-center text-sm text-[#617289]">
                            Нет аккаунта?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="text-blue-500 font-semibold hover:underline"
                            >
                                Зарегистрироваться
                            </button>
                        </p>
                        <div className="mt-6 flex justify-center gap-6 text-xs text-[#617289]">
                            <a className="hover:text-blue-500 transition-colors" href="#">
                                Помощь
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}