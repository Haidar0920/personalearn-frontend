import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        position: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password.length < 8) {
            toast.error('Пароль должен быть не менее 8 символов');
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.post('/auth/register', form, { skipAuth: true } as never);
            toast.success('Аккаунт создан! Войдите в систему.');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ?? 'Ошибка регистрации';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light min-h-screen font-display">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex min-h-screen w-full">
                {/* Left panel */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-blue-500 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-white">
                            <div className="size-8">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">PersonaLearn</span>
                        </div>
                    </div>
                    <div className="relative z-10 max-w-lg">
                        <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
                            Начните обучать команду с первого дня
                        </h1>
                        <p className="text-white/80 text-lg leading-relaxed">
                            Создайте аккаунт руководителя, добавьте сотрудников и назначьте персонализированные курсы — всё за несколько минут.
                        </p>
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                            <Icon name="group" className="text-white mb-2" />
                            <p className="text-white text-sm font-medium">Управление командой</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                            <Icon name="psychology" className="text-white mb-2" />
                            <p className="text-white text-sm font-medium">AI-адаптация</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                            <Icon name="analytics" className="text-white mb-2" />
                            <p className="text-white text-sm font-medium">Аналитика</p>
                        </div>
                    </div>
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-black/10 rounded-full blur-2xl" />
                </div>

                {/* Right panel */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-20 bg-background-light">
                    <div className="w-full max-w-[440px]">
                        <div className="mb-8">
                            <h2 className="text-[#111418] text-3xl font-bold leading-tight tracking-[-0.015em] mb-2">
                                Регистрация
                            </h2>
                            <p className="text-[#617289] text-base">Создайте аккаунт руководителя</p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="flex flex-col gap-2">
                                    <span className="text-[#111418] text-sm font-semibold">Имя</span>
                                    <input
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Иван Петров"
                                        className="form-input flex w-full rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617289] px-4 text-base font-normal transition-all"
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="flex flex-col gap-2">
                                    <span className="text-[#111418] text-sm font-semibold">Название компании</span>
                                    <input
                                        name="companyName"
                                        type="text"
                                        value={form.companyName}
                                        onChange={handleChange}
                                        required
                                        placeholder="ООО «Продажи Плюс»"
                                        className="form-input flex w-full rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617289] px-4 text-base font-normal transition-all"
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="flex flex-col gap-2">
                                    <span className="text-[#111418] text-sm font-semibold">Ваша должность</span>
                                    <input
                                        name="position"
                                        type="text"
                                        value={form.position}
                                        onChange={handleChange}
                                        placeholder="Head of Sales, HR Director..."
                                        className="form-input flex w-full rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617289] px-4 text-base font-normal transition-all"
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="flex flex-col gap-2">
                                    <span className="text-[#111418] text-sm font-semibold">Email</span>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="you@company.com"
                                        className="form-input flex w-full rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617289] px-4 text-base font-normal transition-all"
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="flex flex-col gap-2">
                                    <span className="text-[#111418] text-sm font-semibold">Пароль</span>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Минимум 8 символов"
                                            className="form-input flex w-full rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617289] px-4 pr-12 text-base font-normal transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#617289] hover:text-blue-500 transition-colors"
                                        >
                                            <Icon name={showPassword ? 'visibility_off' : 'visibility'} />
                                        </button>
                                    </div>
                                </label>
                            </div>

                            <div className="pt-2">
                                <Button type="submit" className="w-full h-12" icon={loading ? undefined : 'person_add'} iconPosition="right">
                                    {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
                                </Button>
                            </div>
                        </form>

                        <p className="mt-6 text-center text-sm text-[#617289]">
                            Уже есть аккаунт?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-blue-500 font-semibold hover:underline"
                            >
                                Войти
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
