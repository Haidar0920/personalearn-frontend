import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import { employeesApi, type Employee } from '../api/employees';
import { analyticsApi } from '../api/analytics';

type StatusTone = 'success' | 'warning' | 'neutral';

type MaterialItem = {
  id: number;
  title: string;
  status: string;
  statusTone: StatusTone;
  dueDate: string;
  startDate?: string;
  lastActivity?: string;
  icon: 'book' | 'play' | 'lock';
  iconWrapperClassName: string;
};

const assignedMaterials: MaterialItem[] = [
  {
    id: 1,
    title: 'Техника спин-продаж',
    status: 'Завершено',
    statusTone: 'success',
    dueDate: '15.10.2023',
    icon: 'book',
    iconWrapperClassName: 'bg-blue-50 text-blue-500',
  },
  {
    id: 2,
    title: 'Работа с Enterprise-клиентами',
    status: 'В процессе (65%)',
    statusTone: 'warning',
    dueDate: '—',
    icon: 'play',
    iconWrapperClassName: 'bg-orange-50 text-orange-500',
  },
  {
    id: 3,
    title: 'Архитектура облачных решений',
    status: 'Не начато',
    statusTone: 'neutral',
    dueDate: '—',
    icon: 'lock',
    iconWrapperClassName: 'bg-slate-100 text-slate-500',
  },
];

const discMetrics = [
  {
    key: 'D',
    label: 'ДОМИНИРОВАНИЕ (D)',
    value: 75,
    fillClassName: 'bg-red-500',
    textClassName: 'text-red-500',
  },
  {
    key: 'C',
    label: 'АНАЛИТИЧНОСТЬ (C)',
    value: 88,
    fillClassName: 'bg-blue-500',
    textClassName: 'text-blue-500',
  },
];

const exampleAvatar = 'https://i.pravatar.cc/240?img=12';

function getStatusClasses(statusTone: StatusTone) {
  switch (statusTone) {
    case 'success':
      return 'bg-emerald-100 text-emerald-700';
    case 'warning':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function SvgIcon({
  name,
  className = '',
}: {
  name:
    | 'calendar'
    | 'plus-circle'
    | 'sparkles-box'
    | 'refresh'
    | 'mail'
    | 'info'
    | 'book'
    | 'play'
    | 'lock'
    | 'more'
    | 'help-circle';
  className?: string;
}) {
  const baseClassName = `h-5 w-5 ${className}`.trim();

  if (name === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClassName}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    );
  }

  if (name === 'plus-circle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClassName}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    );
  }

  if (name === 'sparkles-box') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={baseClassName}>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" opacity="0.12" />
        <path
          d="M8 15l1.1-2.9L12 11l-2.9-1.1L8 7l-1.1 2.9L4 11l2.9 1.1L8 15zm9-7l.7-1.8L19.5 5l-1.8-.7L17 2.5l-.7 1.8L14.5 5l1.8.7L17 8zm1 13l.7-1.8 1.8-.7-1.8-.7-.7-1.8-.7 1.8-1.8.7 1.8.7.7 1.8z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === 'refresh') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClassName}>
        <path d="M20 11a8 8 0 10.9 4" />
        <path d="M20 4v7h-7" />
      </svg>
    );
  }

  if (name === 'mail') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClassName}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    );
  }

  if (name === 'info') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClassName}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v6M12 7h.01" />
      </svg>
    );
  }

  if (name === 'book') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClassName}>
        <path d="M5 4.5A2.5 2.5 0 017.5 2H19v18H7.5A2.5 2.5 0 015 22z" />
        <path d="M5 4.5v15" />
        <path d="M9 7h6M9 11h6" />
      </svg>
    );
  }

  if (name === 'play') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={baseClassName}>
        <circle cx="12" cy="12" r="9" opacity="0.15" />
        <path d="M10 8.8l5.5 3.2L10 15.2V8.8z" />
      </svg>
    );
  }

  if (name === 'lock') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClassName}>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 018 0v3" />
      </svg>
    );
  }

  if (name === 'more') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={baseClassName}>
        <circle cx="6" cy="12" r="1.7" />
        <circle cx="12" cy="12" r="1.7" />
        <circle cx="18" cy="12" r="1.7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClassName}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <circle cx="12" cy="16.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [analytics, setAnalytics] = useState<{ oceanLearningProfile?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const [emp, anal] = await Promise.all([
          employeesApi.get(id),
          analyticsApi.employee(id).catch(() => null),
        ]);
        setEmployee(emp);
        setAnalytics(anal);
      } catch {
        setError('Сотрудник не найден.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const initials = useMemo(() => {
    if (!employee?.name) return 'ИИ';
    return employee.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [employee?.name]);

  if (loading) {
    return (
      <PersonaLearnLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </PersonaLearnLayout>
    );
  }

  if (error || !employee) {
    return (
      <PersonaLearnLayout>
        <div className="m-8">
          <p className="text-sm text-slate-500">{error ?? 'Сотрудник не найден.'}</p>
        </div>
      </PersonaLearnLayout>
    );
  }

  const oceanProfile =
    analytics?.oceanLearningProfile ?? employee.oceanLearningProfile ?? 'Не определён';
  const firstName = employee.name.split(' ')[0] || 'Сотрудник';

  const createdAtFormatted = employee.createdAt
    ? new Date(employee.createdAt).toLocaleDateString('ru-RU')
    : '—';

  const statCards = {
    understanding: employee.trainingProgress ?? 0,
    understandingDelta: '',
    gaps: ['Работа с возражениями по цене', 'Глубокое знание технических спецификаций API'],
    strengths: ['Установление раппорта с ЛПР', 'Навыки закрытия сделок'],
  };

  return (
    <PersonaLearnLayout>
      <div className="mx-5 my-6 space-y-7 xl:mx-6 xl:my-7">
        <nav className="flex items-center gap-3 text-[15px] font-semibold text-slate-400">
          <span>Команда</span>
          <span>›</span>
          <span className="text-slate-800">Карточка сотрудника</span>
        </nav>

        <section className="rounded-[24px] border border-slate-200 bg-white px-7 py-7 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-[126px] w-[126px] shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-slate-100 text-[34px] font-black text-slate-500 shadow-inner">
                <img
                  src={exampleAvatar}
                  alt={employee.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="min-w-0 space-y-4">
                <div>
                  <h1 className="text-[34px] font-black leading-none tracking-[-0.03em] text-slate-900">
                    {employee.name}
                  </h1>
                  <p className="mt-2 text-[20px] font-semibold leading-7 text-slate-500">
                    {employee.position || 'Сотрудник'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[14px] font-semibold text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <SvgIcon name="calendar" className="h-4 w-4" />
                    <span>Добавлен: {createdAtFormatted}</span>
                  </span>
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-[14px] font-bold text-blue-600">
                    {oceanProfile}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="inline-flex h-[56px] items-center justify-center gap-3 rounded-[16px] bg-blue-600 px-7 text-[16px] font-bold text-white transition hover:bg-blue-700">
                <SvgIcon name="plus-circle" className="h-5 w-5" />
                Назначить материал
              </button>
              <button className="inline-flex h-[56px] items-center justify-center gap-3 rounded-[16px] border border-slate-200 bg-white px-7 text-[16px] font-bold text-slate-700 transition hover:bg-slate-50">
                <SvgIcon name="mail" className="h-5 w-5" />
                Выгрузить отчёт
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-blue-600 text-white">
                <SvgIcon name="sparkles-box" className="h-[18px] w-[18px]" />
              </div>
              <h2 className="text-[28px] font-black tracking-[-0.03em] text-slate-900">
                Результаты AI-диалога
              </h2>
            </div>
            <p className="text-[14px] font-semibold text-slate-400">Обновлено: сегодня</p>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
              <article className="rounded-[24px] border border-slate-200 bg-white px-8 py-7 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                <h3 className="max-w-[180px] text-[18px] font-bold leading-[1.25] text-slate-500">
                  Показатель понимания
                </h3>

                <div className="mt-7 flex items-center justify-center">
                  <div
                    className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#2f6fed ${statCards.understanding * 3.6}deg, #e5e7eb 0deg)`,
                    }}
                  >
                    <div className="flex h-[106px] w-[106px] items-center justify-center rounded-full bg-white text-[34px] font-black text-slate-900">
                      {statCards.understanding}%
                    </div>
                  </div>
                </div>

                {statCards.understandingDelta && (
                  <p className="mt-7 text-center text-[16px] font-bold text-emerald-500">
                    {statCards.understandingDelta}
                  </p>
                )}
              </article>

              <article className="rounded-[24px] border border-slate-200 bg-white px-6 py-7 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-4 md:border-r md:border-slate-200 md:pr-8">
                    <div className="flex items-center gap-2 text-[18px] font-bold text-slate-600">
                      <span className="text-red-500">▲</span>
                      <h3>Ключевые пробелы</h3>
                    </div>
                    <ul className="space-y-4 text-[16px] font-medium leading-9 text-slate-700">
                      {statCards.gaps.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-[14px] h-2.5 w-2.5 shrink-0 rounded-full bg-red-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 md:pl-8">
                    <div className="flex items-center gap-2 text-[18px] font-bold text-slate-600">
                      <span className="text-emerald-500">✦</span>
                      <h3>Сильные стороны</h3>
                    </div>
                    <ul className="space-y-4 text-[16px] font-medium leading-9 text-slate-700">
                      {statCards.strengths.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-[14px] h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            <aside className="space-y-6">
              <article className="rounded-[24px] border border-slate-200 bg-white px-7 py-7 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                <h3 className="text-[24px] font-black tracking-[-0.03em] text-slate-900">
                  Быстрые действия
                </h3>
                <div className="mt-6 space-y-4">
                  <button className="flex h-[56px] w-full items-center justify-center gap-3 rounded-[16px] bg-blue-600 px-5 text-[16px] font-bold text-white transition hover:bg-blue-700">
                    <SvgIcon name="plus-circle" className="h-5 w-5" />
                    Назначить обучение
                  </button>
                  <button className="flex h-[56px] w-full items-center justify-center gap-3 rounded-[16px] bg-blue-50 px-5 text-[16px] font-bold text-blue-600 transition hover:bg-blue-100">
                    <SvgIcon name="refresh" className="h-5 w-5" />
                    Переназначить материал
                  </button>
                  <button className="flex h-[56px] w-full items-center justify-center gap-3 rounded-[16px] border border-slate-200 bg-white px-5 text-[16px] font-bold text-slate-900 transition hover:bg-slate-50">
                    <SvgIcon name="mail" className="h-5 w-5" />
                    Отправить отчет руководителю
                  </button>
                </div>
              </article>

              <article className="rounded-[24px] border border-slate-200 bg-white px-7 py-7 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[24px] font-black tracking-[-0.03em] text-slate-900">
                    Профиль DISC
                  </h3>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <SvgIcon name="info" className="h-[18px] w-[18px]" />
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {discMetrics.map((item) => (
                    <div key={item.key} className="space-y-2.5">
                      <div className="flex items-center justify-between gap-3 text-[14px] font-black uppercase">
                        <span className={item.textClassName}>{item.label}</span>
                        <span className="text-slate-700">{item.value}%</span>
                      </div>
                      <div className="h-[8px] rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${item.fillClassName}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <blockquote className="mt-6 rounded-[16px] bg-slate-50 px-5 py-4 text-[16px] italic leading-8 text-slate-500">
                  "{firstName} ориентирован на результат и детали. Предпочитает структурные данные и
                  четкие аргументы в коммуникации."
                </blockquote>
              </article>
            </aside>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between px-7 py-5">
              <h2 className="text-[28px] font-black tracking-[-0.03em] text-slate-900">
                Назначенные материалы
              </h2>
              <button className="text-[16px] font-bold text-blue-600 transition hover:text-blue-700">
                Смотреть все
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-t border-slate-100 text-left text-[14px] font-black uppercase tracking-[0.06em] text-slate-400">
                    <th className="px-7 py-5">Название темы</th>
                    <th className="px-7 py-5">Статус</th>
                    <th className="px-7 py-5">Дата начала</th>
                    <th className="px-7 py-5">Дата завершения</th>
                    <th className="px-7 py-5 text-right">Последняя активность</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedMaterials.map((material) => (
                    <tr key={material.id} className="border-t border-slate-200 text-slate-800">
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${material.iconWrapperClassName}`}
                          >
                            <SvgIcon name={material.icon} className="h-[18px] w-[18px]" />
                          </div>
                          <span className="max-w-[280px] text-[16px] font-bold leading-7">
                            {material.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-7 py-5">
                        <span
                          className={`inline-flex rounded-full px-4 py-2 text-[14px] font-bold leading-none ${getStatusClasses(material.statusTone)}`}
                        >
                          {material.status}
                        </span>
                      </td>
                      <td className="px-7 py-5 text-[16px] font-medium text-slate-500">
                        {material.startDate ?? '—'}
                      </td>
                      <td className="px-7 py-5 text-[16px] font-medium text-slate-500">
                        {material.dueDate}
                      </td>
                      <td className="px-7 py-5 text-right text-[16px] font-medium text-slate-500">
                        {material.lastActivity ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <div />
        </section>
      </div>
    </PersonaLearnLayout>
  );
}
