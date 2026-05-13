import { useEffect, useState } from 'react';
import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { employeesApi, Employee, DashboardStats } from '../api/employees';

export default function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [empList, empStats] = await Promise.all([
                employeesApi.list(),
                employeesApi.dashboardStats(),
            ]);
            setEmployees(empList);
            setStats(empStats);
        } catch (e) {
            console.error('Failed to load employees', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (value: string) => {
        setSearch(value);
        try {
            const result = await employeesApi.list(value);
            setEmployees(result);
        } catch (e) {
            console.error('Search failed', e);
        }
    };

    const getAvatarColor = (color: string) => {
        const colors: Record<string, string> = {
            blue: 'bg-blue-100 text-blue-600',
            emerald: 'bg-emerald-100 text-emerald-600',
            amber: 'bg-amber-100 text-amber-600',
            violet: 'bg-violet-100 text-violet-600',
            rose: 'bg-rose-100 text-rose-600',
            cyan: 'bg-cyan-100 text-cyan-600',
            orange: 'bg-orange-100 text-orange-600',
        };
        return colors[color] || colors.blue;
    };

    const getProgressColor = (progress: number) => {
        if (progress === 100) return 'bg-green-500';
        if (progress >= 50) return 'bg-blue-500';
        return 'bg-amber-500';
    };

    return (
        <PersonaLearnLayout>
            <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 p-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Список сотрудников</h2>
                    <p className="text-xs text-slate-500">Управление персоналом и контроль обучения</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl"/>
                        <input
                            className="w-72 bg-slate-100 border-none focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-10 pr-4 py-2 text-sm"
                            placeholder="Поиск по команде..."
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <Button icon="person_add" iconPosition="left" className="py-2.5 px-6"
                        onClick={() => navigate('/employee-list/new')}>
                        Добавить сотрудника
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 m-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Всего в штате</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black">{stats?.totalEmployees ?? '—'}</p>
                        <Icon name="trending_up" className="text-green-500"/>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Проходят обучение</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black">{stats?.inTraining ?? '—'}</p>
                        <div className="flex -space-x-2">
                            <div className="size-6 rounded-full border-2 border-white bg-slate-300"></div>
                            <div className="size-6 rounded-full border-2 border-white bg-slate-400"></div>
                            <div className="size-6 rounded-full border-2 border-white bg-slate-500"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Ср. результат AI</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-blue-500">{stats?.averageAiScore ?? '—'}</p>
                        <span className="text-blue-500/60 text-xs font-medium">из 10</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Завершили курс</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black">{stats?.completedCourse ?? '—'}</p>
                        <Icon name="workspace_premium" className="text-amber-400"/>
                    </div>
                </div>
            </div>

            <div className="m-8 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-slate-400">
                        <Icon name="progress_activity" className="animate-spin text-3xl mr-2"/>
                        Загрузка...
                    </div>
                ) : employees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Icon name="group" className="text-5xl mb-3"/>
                        <p className="font-semibold">Сотрудники не найдены</p>
                        <p className="text-sm mt-1">Добавьте первого сотрудника</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Сотрудник</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Должность</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Прогресс</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Действия</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {employees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-10 rounded-full ${getAvatarColor(employee.avatarColor)} flex items-center justify-center font-bold text-sm`}>
                                                {employee.avatarInitials}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{employee.name}</span>
                                                <span className="text-xs text-slate-400">{employee.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                                            {employee.position || '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3 max-w-[160px]">
                                            <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                                                <div
                                                    className={`h-full ${getProgressColor(employee.trainingProgress)} rounded-full`}
                                                    style={{width: `${employee.trainingProgress}%`}}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">
                                                {employee.trainingProgress}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => navigate(`/employee/${employee.id}`)}
                                            className="px-3 py-1.5 text-xs font-bold text-blue-500 hover:bg-blue-500/5 rounded-lg transition-colors">
                                            Подробнее
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                        Показано {employees.length} из {stats?.totalEmployees ?? employees.length} сотрудников
                    </span>
                </div>
            </div>
        </PersonaLearnLayout>
    );
}
