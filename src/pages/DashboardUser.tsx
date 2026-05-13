import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import { employeesApi, type Employee } from '../api/employees';

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
  footer?: React.ReactNode;
};

function StatCard({ icon, label, value, badge, footer }: StatCardProps) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white px-8 py-8 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-4 text-slate-400">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400 xl:text-[13px]">
          {label}
        </p>
      </div>

      <div className="mt-7 flex items-end gap-4">
        <span className="text-[28px] font-black leading-none tracking-[-0.02em] text-slate-950 xl:text-[32px]">
          {value}
        </span>
        {badge ? (
          <span className="rounded-xl bg-emerald-100 px-4 py-2 text-[14px] font-bold leading-none text-emerald-700 xl:text-[16px]">
            {badge}
          </span>
        ) : null}
      </div>

      {footer ? <div className="mt-4">{footer}</div> : null}
    </article>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <rect x="7" y="4" width="10" height="16" rx="2" />
      <path d="M9 4.5h6M9 8h6" />
      <rect x="9" y="2" width="6" height="4" rx="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BadgeCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.8l2.1 1.5 2.5-.2 1.2 2.2 2.2 1.2-.2 2.5 1.5 2.1-1.5 2.1.2 2.5-2.2 1.2-1.2 2.2-2.5-.2-2.1 1.5-2.1-1.5-2.5.2-1.2-2.2-2.2-1.2.2-2.5L2.8 12l1.5-2.1-.2-2.5 2.2-1.2 1.2-2.2 2.5.2L12 2.8z" />
      <path
        d="M9.5 12.1l1.7 1.7 3.5-4"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" opacity="0.18" />
      <path d="M12 6.9l1.4 2.9 3.2.5-2.3 2.2.6 3.2L12 14.2l-2.9 1.5.6-3.2-2.3-2.2 3.2-.5L12 6.9z" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M5 4v15" />
      <path d="M5 5h10l-1.2 2.5L15 10H5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M5 4.5A2.5 2.5 0 017.5 2H19v18H7.5A2.5 2.5 0 015 22z" />
      <path d="M5 4.5v15" />
      <path d="M9 7h6M9 11h6" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M13 2L6 13h4l-1 9 9-12h-5l0-8z" />
    </svg>
  );
}

function RobotGhost() {
  return (
    <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28px] bg-white/30 backdrop-blur-sm">
      <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14 text-white/80">
        <rect x="16" y="18" width="32" height="24" rx="10" fill="currentColor" opacity="0.9" />
        <circle cx="26" cy="30" r="3" fill="#b9c8e8" />
        <circle cx="38" cy="30" r="3" fill="#b9c8e8" />
        <path d="M24 38h16" stroke="#b9c8e8" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 12v6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="32" cy="10" r="3" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function DashboardUser() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        let emp = await employeesApi.me();
        setEmployee(emp);
        if (emp.onboardingCompleted === false) {
          navigate('/onboarding', { replace: true });
          return;
        }
      } catch (err: unknown) {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr?.response?.status === 404) {
          try {
            const linked = await employeesApi.linkUser();
            setEmployee(linked);
            if (linked.onboardingCompleted === false) {
              navigate('/onboarding', { replace: true });
              return;
            }
          } catch {
            // Can't link, show default UI
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadEmployee();
  }, [navigate]);

  if (loading) {
    return (
      <PersonaLearnLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </PersonaLearnLayout>
    );
  }

  const firstName = employee?.name?.split(' ')[0] ?? 'Сотрудник';
  const materialsCount = employee?.materialsCount ?? 0;
  const progress = employee?.trainingProgress ?? 0;

  return (
    <PersonaLearnLayout>
      <div className="mx-5 my-6 space-y-8 xl:mx-6 xl:my-7">
        <section className="space-y-5">
          <div>
            <h1 className="text-[26px] font-black leading-none tracking-[-0.02em] text-slate-950 md:text-[30px] xl:text-[32px]">
              Привет, {firstName}! 👋
            </h1>
          </div>

          <div className="inline-flex max-w-full items-center gap-3 rounded-2xl bg-blue-50 px-6 py-4 text-blue-600 shadow-sm">
            <FlagIcon />
            <p className="text-[14px] font-semibold leading-6 text-blue-600 xl:text-[15px]">
              Цель на неделю: завершить 2 модуля и пройти AI-диалог.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <StatCard icon={<ClipboardIcon />} label="Назначено тем" value={String(materialsCount)} />
          <StatCard
            icon={<BadgeCheckIcon />}
            label="Завершено"
            value={`${progress}%`}
            badge={progress > 0 ? `+${progress}%` : undefined}
          />
          <StatCard
            icon={<StarCircleIcon />}
            label="Ваш профиль обучения"
            value={employee?.oceanLearningProfile ?? 'Не определён'}
          />
        </section>

        <section className="overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-[0_6px_18px_rgba(37,99,235,0.08)]">
          <div className="grid grid-cols-1 xl:grid-cols-[440px_minmax(0,1fr)]">
            <div className="relative min-h-[330px] overflow-hidden bg-gradient-to-br from-[#dce9ff] via-[#d4e3fb] to-[#edf4ff]">
              <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_bottom,rgba(222,234,248,0)_0%,rgba(220,230,242,0.55)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#eef4fb]" />
              <div className="absolute bottom-10 left-1/2 h-5 w-[170px] -translate-x-1/2 rounded-full bg-slate-300/25 blur-md" />
              <div className="absolute bottom-0 left-1/2 h-[92px] w-[190px] -translate-x-1/2 rounded-t-[6px] border-x-[10px] border-t-[10px] border-[#d0b08e] bg-[#ebd2b7]" />
              <div className="absolute bottom-[76px] left-1/2 h-3 w-[220px] -translate-x-1/2 rounded-[4px] bg-[#e8cfb1] shadow-[0_10px_20px_rgba(148,114,84,0.16)]" />
              <div className="absolute bottom-[79px] left-[calc(50%-85px)] h-[54px] w-3 rounded-b-md bg-[#d6b28d]" />
              <div className="absolute bottom-[79px] right-[calc(50%-85px)] h-[54px] w-3 rounded-b-md bg-[#d6b28d]" />
              <div className="absolute bottom-[82px] left-1/2 h-[70px] w-[58px] -translate-x-1/2 rounded-b-[20px] rounded-t-[12px] bg-[#cba279]" />
              <div className="absolute bottom-[138px] left-[calc(50%+6px)] h-[96px] w-[16px] rotate-[8deg] rounded-full bg-[#2f6b48]" />
              <div className="absolute bottom-[154px] left-[calc(50%-8px)] h-[82px] w-[16px] -rotate-[10deg] rounded-full bg-[#3b7f57]" />
              <div className="absolute bottom-[146px] left-[calc(50%+22px)] h-[84px] w-[14px] rotate-[20deg] rounded-full bg-[#2e6d49]" />
              <RobotGhost />
            </div>

            <div className="flex flex-col justify-center px-8 py-8 xl:px-10 xl:py-10">
              <div className="flex flex-wrap items-center gap-3 text-slate-400">
                <span className="rounded-xl bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-blue-600 xl:text-[12px]">
                  В фокусе
                </span>
                <span className="text-[18px] text-slate-400">•</span>
                <span className="text-[15px] font-medium text-slate-400 xl:text-[16px]">
                  Продолжите обучение
                </span>
              </div>

              <h2 className="mt-4 max-w-[760px] text-[22px] font-black leading-tight tracking-[-0.02em] text-slate-950 xl:text-[26px]">
                Ваш персонализированный план обучения готов
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-[1.6] text-slate-500 xl:text-[15px]">
                Отработайте навыки в безопасной среде с нашим AI-тренажером. Система оценит вашу
                уверенность и точность формулировок.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate('/training')}
                  className="inline-flex h-[54px] items-center justify-center gap-3 rounded-[16px] bg-blue-600 px-6 text-[15px] font-bold text-white shadow-[0_8px_14px_rgba(37,99,235,0.25)] transition hover:bg-blue-700 xl:h-[56px] xl:text-[16px]"
                >
                  Продолжить обучение
                  <BoltIcon />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/training-materials')}
                  className="inline-flex h-[54px] items-center justify-center gap-3 rounded-[16px] border border-slate-200 bg-white px-6 text-[15px] font-bold text-slate-800 transition hover:bg-slate-50 xl:h-[56px] xl:text-[16px]"
                >
                  <BookIcon />
                  Теория
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PersonaLearnLayout>
  );
}
