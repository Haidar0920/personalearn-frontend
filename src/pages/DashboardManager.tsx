import { useState, useEffect } from 'react';
import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import KPICard from '../components/KPICard';
import ProgressChart from '../components/ProgressChart';
import MasteryChart from '../components/MasteryChart';
import { employeesApi, type DashboardStats } from '../api/employees';
import dashboardData from '../data/dashboard2.json';

export default function DashboardManager() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    employeesApi.dashboardStats().then(setStats).catch(() => {
      // Silently fall back to mock data on error
    });
  }, []);

  const kpis = stats
    ? [
        {
          icon: 'group',
          label: 'Всего сотрудников',
          value: String(stats.totalEmployees),
          change: '',
          changeType: 'positive' as const,
          iconBgColor: 'blue' as const,
        },
        {
          icon: 'school',
          label: 'В обучении',
          value: String(stats.inTraining),
          change: '',
          changeType: 'positive' as const,
          iconBgColor: 'emerald' as const,
        },
        {
          icon: 'psychology',
          label: 'Средний AI Score',
          value: String(stats.averageAiScore),
          change: '',
          changeType: 'positive' as const,
          iconBgColor: 'amber' as const,
        },
        {
          icon: 'verified',
          label: 'Завершили курс',
          value: String(stats.completedCourse),
          change: '',
          changeType: 'positive' as const,
          iconBgColor: 'purple' as const,
        },
      ]
    : dashboardData.kpis;

  return (
    <PersonaLearnLayout>
      <div className="space-y-8 m-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <KPICard
              key={index}
              icon={kpi.icon}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              changeType={kpi.changeType as 'positive' | 'negative'}
              iconBgColor={kpi.iconBgColor as 'blue' | 'emerald' | 'amber' | 'purple'}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ProgressChart
              title="Прогресс по сотрудникам"
              subtitle="Топ-7 по активности за текущий месяц"
              employees={dashboardData.progressData}
            />
          </div>
          <div className="lg:col-span-4">
            <MasteryChart
              title="Освоение"
              subtitle="Статистика материалов"
              totalPercentage={dashboardData.masteryData.totalPercentage}
              categories={dashboardData.masteryData.categories.map((cat) => ({
                ...cat,
                color: cat.color as 'blue' | 'emerald' | 'orange',
              }))}
            />
          </div>
        </div>
      </div>
    </PersonaLearnLayout>
  );
}
