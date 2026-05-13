import { useState, useEffect } from 'react';
import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import Icon from '../components/Icon';
import { analyticsApi, type EmployeeAnalytics, type AnalyticsOverview } from '../api/analytics';
import analyticsData from '../data/analyticsAdmin2.json';

export default function AnalyticsAdmin() {
  const [employees, setEmployees] = useState<EmployeeAnalytics[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.employees(), analyticsApi.overview()])
      .then(([emps, ov]) => {
        setEmployees(emps);
        setOverview(ov);
      })
      .catch(() => {
        // Keep defaults (empty state) on error
      })
      .finally(() => setLoading(false));
  }, []);

  const getGapColor = (severity: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; bar: string; progress: string }> = {
      high: {
        bg: 'bg-red-50',
        border: 'border-red-100',
        text: 'text-red-700',
        bar: 'bg-red-200',
        progress: 'bg-red-500',
      },
      medium: {
        bg: 'bg-orange-50',
        border: 'border-orange-100',
        text: 'text-orange-700',
        bar: 'bg-orange-200',
        progress: 'bg-orange-500',
      },
      low: {
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        text: 'text-blue-700',
        bar: 'bg-blue-200',
        progress: 'bg-blue-500',
      },
    };
    return colors[severity] || colors.low;
  };

  const getCompetencyColor = (level: number) => {
    if (level >= 80) return { bg: 'bg-green-500', text: 'text-green-600' };
    if (level >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-600' };
    return { bg: 'bg-red-500', text: 'text-red-600' };
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <PersonaLearnLayout title="Аналитика" showSearch>
      <div className="m-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#111418] tracking-tight">
            Аналитика PersonaLearn
          </h2>
          <p className="text-gray-500 mt-1">
            Детальные ИИ-инсайты по эффективности обучения сотрудников
          </p>
        </div>
        {overview && (
          <div className="flex gap-4 text-sm">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
              <span className="font-bold text-slate-800">{overview.totalEmployees}</span>
              <span className="text-gray-500 ml-1">сотрудников</span>
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
              <span className="font-bold text-blue-600">{overview.inTraining}</span>
              <span className="text-gray-500 ml-1">в обучении</span>
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
              <span className="font-bold text-emerald-600">{overview.avgAiScore}</span>
              <span className="text-gray-500 ml-1">avg AI score</span>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer">
            <Icon name="calendar_month" className="text-[18px]" />
            <span>01 Окт — 31 Окт</span>
          </div>
        </div>
      </div>

      <div className="m-8 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold">Карта компетенций (AI Radar)</h3>
              <p className="text-xs text-gray-500">Сравнение текущих навыков с целевыми показателями</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-xs font-medium">
                <span className="size-2.5 rounded-full bg-blue-500"></span> Факт
              </span>
              <span className="flex items-center gap-2 text-xs font-medium">
                <span className="size-2.5 rounded-full bg-gray-200"></span> Цель
              </span>
            </div>
          </div>
          <div className="h-[340px] flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-[300px] h-[300px] border border-gray-400 rounded-full border-dashed"></div>
              <div className="absolute w-[200px] h-[200px] border border-gray-400 rounded-full border-dashed"></div>
              <div className="absolute w-[100px] h-[100px] border border-gray-400 rounded-full border-dashed"></div>
            </div>
            <svg className="w-[300px] h-[300px] drop-shadow-xl transform -rotate-18" viewBox="0 0 100 100">
              <polygon
                className="text-gray-200 dark:text-gray-700"
                fill="none"
                points="50,5 95,35 80,85 20,85 5,35"
                stroke="currentColor"
                strokeWidth="0.2"
              />
              <polygon
                fill="rgba(226, 232, 240, 0.3)"
                points="50,15 85,40 75,75 25,75 15,40"
                stroke="#cbd5e1"
                strokeWidth="0.5"
              />
              <polygon
                fill="rgba(19, 109, 236, 0.2)"
                points="50,10 92,38 78,82 28,70 12,42"
                stroke="#136dec"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <circle cx="50" cy="10" fill="#136dec" r="1.5" />
              <circle cx="92" cy="38" fill="#136dec" r="1.5" />
              <circle cx="78" cy="82" fill="#136dec" r="1.5" />
              <circle cx="28" cy="70" fill="#136dec" r="1.5" />
              <circle cx="12" cy="42" fill="#136dec" r="1.5" />
            </svg>
            <div className="absolute top-0 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                Знание продукта
              </span>
              <span className="text-xs font-bold">{analyticsData.radarData.fact.productKnowledge}</span>
            </div>
            <div className="absolute right-0 top-1/3 text-right">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                Уверенность
              </span>
              <p className="text-xs font-bold">{analyticsData.radarData.fact.confidence}</p>
            </div>
            <div className="absolute bottom-4 right-1/4 text-right">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                Возражения
              </span>
              <p className="text-xs font-bold">{analyticsData.radarData.fact.objections}</p>
            </div>
            <div className="absolute bottom-4 left-1/4 text-left">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                Эмпатия
              </span>
              <p className="text-xs font-bold">{analyticsData.radarData.fact.empathy}</p>
            </div>
            <div className="absolute left-0 top-1/3 text-left">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                Закрытие
              </span>
              <p className="text-xs font-bold">{analyticsData.radarData.fact.closing}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Пробелы в знаниях</h3>
          <div className="space-y-5">
            {analyticsData.knowledgeGaps.map((gap) => {
              const colors = getGapColor(gap.severity);
              return (
                <div key={gap.id} className={`p-4 ${colors.bg} border ${colors.border} rounded-lg`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-bold ${colors.text}`}>{gap.title}</span>
                    {gap.trend && (
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded ${colors.text}`}
                      >
                        {gap.trend > 0 ? '+' : ''}
                        {gap.trend}%
                      </span>
                    )}
                    {!gap.trend && (
                      <span className={`text-xs font-black px-2 py-0.5 rounded ${colors.text}`}>
                        {gap.progress}%
                      </span>
                    )}
                  </div>
                  <div className={`w-full ${colors.bar} h-1.5 rounded-full overflow-hidden`}>
                    <div className={`${colors.progress} h-full`} style={{ width: `${gap.progress}%` }} />
                  </div>
                  {gap.message && (
                    <p className={`text-[11px] ${colors.text} mt-2 font-medium`}>{gap.message}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="m-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Рейтинг сотрудников и AI-фидбек</h3>
            <p className="text-sm text-gray-500">Автоматический анализ диалогов за последнюю неделю</p>
          </div>
          <button className="text-blue-500 text-sm font-bold hover:underline flex items-center gap-1">
            Все сотрудники <Icon name="chevron_right" className="text-sm" />
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : employees.length === 0 ? (
            <div className="py-16 text-center text-slate-500">Нет данных о сотрудниках</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                  <th className="px-6 py-4">Сотрудник</th>
                  <th className="px-6 py-4">Профиль OCEAN</th>
                  <th className="px-6 py-4">Прогресс</th>
                  <th className="px-6 py-4">AI Score</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((employee) => {
                  const compColors = getCompetencyColor(employee.trainingProgress);
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-black text-sm">
                            {getInitials(employee.name)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {employee.oceanLearningProfile || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 w-20 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`${compColors.bg} h-full`}
                              style={{ width: `${employee.trainingProgress}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${compColors.text}`}>
                            {employee.trainingProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black bg-gray-100 px-2 py-1 rounded">
                          {employee.avgAiScore}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button className="size-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400">
                          <Icon name="more_vert" className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PersonaLearnLayout>
  );
}
