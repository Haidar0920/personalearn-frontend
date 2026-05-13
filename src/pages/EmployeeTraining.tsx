import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { employeesApi, type EmployeeMaterialItem } from '../api/employees';

const TYPE_ICON: Record<string, string> = {
    pdf: 'description',
    audio: 'audio_file',
    video: 'play_circle',
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    assigned: { label: 'Назначено', color: 'bg-slate-100 text-slate-600' },
    in_progress: { label: 'В процессе', color: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Завершено', color: 'bg-emerald-100 text-emerald-700' },
};

export default function EmployeeTraining() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const materialId = searchParams.get('materialId');

    const [materials, setMaterials] = useState<EmployeeMaterialItem[]>([]);
    const [current, setCurrent] = useState<EmployeeMaterialItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [employeeId, setEmployeeId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const me = await employeesApi.me();
                setEmployeeId(me.id);
                const mats = await employeesApi.myMaterials();
                setMaterials(mats);

                if (materialId) {
                    const found = mats.find(m => m.materialId === materialId);
                    if (found) {
                        setCurrent(found);
                        // Mark as in_progress if still assigned
                        if (found.status === 'assigned') {
                            await employeesApi.startMaterial(me.id, materialId);
                            // update local state
                            setMaterials(prev => prev.map(m =>
                                m.materialId === materialId ? { ...m, status: 'in_progress' } : m
                            ));
                            setCurrent(prev => prev ? { ...prev, status: 'in_progress' } : null);
                        }
                    }
                } else if (mats.length > 0) {
                    // Show first in_progress or first assigned
                    const inProgress = mats.find(m => m.status === 'in_progress');
                    setCurrent(inProgress ?? mats[0]);
                }
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [materialId]);

    if (loading) {
        return (
            <PersonaLearnLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
            </PersonaLearnLayout>
        );
    }

    if (materials.length === 0) {
        return (
            <PersonaLearnLayout>
                <div className="m-8 flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
                    <Icon name="library_books" className="text-[64px] text-[#dbe0e6]" />
                    <h2 className="text-xl font-bold text-[#111418]">Материалы ещё не назначены</h2>
                    <p className="text-[#617289]">Руководитель добавит учебные материалы — они появятся здесь.</p>
                </div>
            </PersonaLearnLayout>
        );
    }

    return (
        <PersonaLearnLayout>
            <div className="m-8 max-w-[1100px]">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm font-medium text-[#617289] mb-6">
                    <button className="hover:text-blue-500 transition-colors" onClick={() => navigate('/dashboard')}>
                        Главная
                    </button>
                    <Icon name="chevron_right" className="text-[16px]" />
                    <span className="text-[#111418]">Обучение</span>
                    {current && (
                        <>
                            <Icon name="chevron_right" className="text-[16px]" />
                            <span className="text-[#111418] truncate max-w-[200px]">{current.title}</span>
                        </>
                    )}
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                    {/* Sidebar — materials list */}
                    <aside className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#617289] mb-3">
                            Мои материалы
                        </h3>
                        {materials.map((m) => {
                            const isActive = current?.materialId === m.materialId;
                            const statusInfo = STATUS_LABEL[m.status] ?? STATUS_LABEL['assigned'];
                            return (
                                <button
                                    key={m.materialId}
                                    onClick={() => navigate(`/training?materialId=${m.materialId}`)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                                        isActive
                                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                                            : 'border-[#e5e7eb] bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 p-1.5 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'bg-[#f0f2f4] text-[#617289]'}`}>
                                            <Icon name={TYPE_ICON[m.type] ?? 'article'} className="text-[18px]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold truncate ${isActive ? 'text-blue-700' : 'text-[#111418]'}`}>
                                                {m.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                                {m.progressPercent > 0 && (
                                                    <span className="text-[11px] text-[#617289]">{m.progressPercent}%</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </aside>

                    {/* Main content */}
                    {current ? (
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_LABEL[current.status]?.color ?? ''}`}>
                                        {STATUS_LABEL[current.status]?.label ?? current.status}
                                    </span>
                                    <span className="text-xs text-[#617289] uppercase font-semibold">
                                        {current.type === 'pdf' ? 'PDF-документ' : current.type === 'audio' ? 'Аудио' : 'Видео'}
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-[#111418] mb-1">{current.title}</h1>
                                {current.description && (
                                    <p className="text-[#617289] leading-relaxed">{current.description}</p>
                                )}
                                {current.deadline && (
                                    <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                                        <Icon name="schedule" className="text-[16px]" />
                                        Дедлайн: {new Date(current.deadline).toLocaleDateString('ru-RU')}
                                    </p>
                                )}
                            </div>

                            {/* Material viewer */}
                            {current.type === 'pdf' ? (
                                <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
                                        <div className="flex items-center gap-3">
                                            <Icon name="description" className="text-red-500 text-[24px]" />
                                            <div>
                                                <p className="font-semibold text-sm text-[#111418]">{current.title}</p>
                                                <p className="text-xs text-[#617289]">PDF-документ</p>
                                            </div>
                                        </div>
                                        <a
                                            href={current.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-500 text-sm font-semibold hover:underline"
                                        >
                                            <Icon name="open_in_new" className="text-[16px]" />
                                            Открыть
                                        </a>
                                    </div>
                                    <iframe
                                        src={current.fileUrl}
                                        className="w-full h-[500px]"
                                        title={current.title}
                                    />
                                </div>
                            ) : current.type === 'video' ? (
                                <div className="relative aspect-video w-full bg-[#111418] rounded-xl overflow-hidden shadow-lg">
                                    <video
                                        src={current.fileUrl}
                                        controls
                                        className="w-full h-full"
                                        poster=""
                                    >
                                        Ваш браузер не поддерживает видео.
                                    </video>
                                </div>
                            ) : (
                                <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 flex items-center gap-5">
                                    <div className="p-4 bg-blue-50 rounded-xl">
                                        <Icon name="audio_file" className="text-blue-500 text-[36px]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-[#111418]">{current.title}</p>
                                        <p className="text-sm text-[#617289] mb-3">Аудио-материал</p>
                                        <audio src={current.fileUrl} controls className="w-full" />
                                    </div>
                                </div>
                            )}

                            {/* Progress bar */}
                            {current.progressPercent > 0 && (
                                <div>
                                    <div className="flex justify-between text-xs text-[#617289] mb-1">
                                        <span>Прогресс</span>
                                        <span>{current.progressPercent}%</span>
                                    </div>
                                    <div className="h-2 bg-[#f0f2f4] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all"
                                            style={{ width: `${current.progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* AI Score badge */}
                            {current.aiScore != null && (
                                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                    <Icon name="stars" className="text-emerald-600 text-[24px]" />
                                    <div>
                                        <p className="font-semibold text-emerald-800">
                                            AI-оценка: {current.aiScore}/10
                                        </p>
                                        <p className="text-sm text-emerald-600">Материал завершён</p>
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            {current.status !== 'completed' && (
                                <div className="pt-4 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center gap-4">
                                    <p className="text-sm text-[#617289] flex-1">
                                        Изучили материал? Пройдите AI-диалог для проверки знаний и получения оценки.
                                    </p>
                                    <Button
                                        icon="psychology"
                                        iconPosition="right"
                                        className="min-w-[220px]"
                                        onClick={() => navigate(`/ai-helper?materialId=${current.materialId}`)}
                                    >
                                        AI-проверка знаний
                                    </Button>
                                </div>
                            )}

                            {current.status === 'completed' && (
                                <div className="pt-4 border-t border-[#e5e7eb] flex items-center gap-4">
                                    <p className="text-sm text-[#617289] flex-1">
                                        Хотите ещё раз поговорить с AI-тренером по этому материалу?
                                    </p>
                                    <Button
                                        icon="chat"
                                        iconPosition="right"
                                        className="min-w-[200px]"
                                        onClick={() => navigate(`/ai-helper?materialId=${current.materialId}`)}
                                    >
                                        Диалог с AI
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                            <Icon name="library_books" className="text-[48px] text-[#dbe0e6] mb-3" />
                            <p className="text-[#617289]">Выберите материал из списка слева</p>
                        </div>
                    )}
                </div>
            </div>
        </PersonaLearnLayout>
    );
}
