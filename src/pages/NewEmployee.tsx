import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import Button from '../components/Button';
import { employeesApi } from '../api/employees';

export default function NewEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const employee = await employeesApi.create({
        name: form.name,
        email: form.email,
        position: form.position,
        department: form.department || undefined,
      });

      await employeesApi.invite(employee.id);

      toast.success('Сотрудник добавлен, приглашение отправлено');
      navigate('/employee-list');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message ?? (err as { message?: string })?.message ?? 'Ошибка при создании сотрудника';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PersonaLearnLayout>
      <div className="mx-5 my-6 xl:mx-6 xl:my-7">
        <nav className="flex items-center gap-3 text-[15px] font-semibold text-slate-400 mb-6">
          <span
            className="cursor-pointer hover:text-slate-600 transition-colors"
            onClick={() => navigate('/employee-list')}
          >
            Команда
          </span>
          <span>›</span>
          <span className="text-slate-800">Новый сотрудник</span>
        </nav>

        <div className="max-w-xl">
          <div className="rounded-[24px] border border-slate-200 bg-white px-8 py-8 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <h1 className="text-[28px] font-black tracking-[-0.02em] text-slate-900 mb-2">
              Добавить сотрудника
            </h1>
            <p className="text-[15px] text-slate-500 mb-8">
              Заполните данные. Сотрудник получит письмо с приглашением на email.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Иван Иванов"
                  className="flex w-full rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617289] px-4 text-base font-normal transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="ivan@company.com"
                  className="flex w-full rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617289] px-4 text-base font-normal transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Должность <span className="text-red-500">*</span>
                </label>
                <input
                  name="position"
                  type="text"
                  value={form.position}
                  onChange={handleChange}
                  required
                  placeholder="Менеджер по продажам"
                  className="flex w-full rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617289] px-4 text-base font-normal transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Отдел
                </label>
                <input
                  name="department"
                  type="text"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Отдел продаж"
                  className="flex w-full rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-[#dbe0e6] bg-white h-12 placeholder:text-[#617289] px-4 text-base font-normal transition-all"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  type="submit"
                  className="flex-1 h-12"
                  icon={loading ? undefined : 'person_add'}
                  iconPosition="right"
                >
                  {loading ? 'Сохранение...' : 'Добавить сотрудника'}
                </Button>
                <button
                  type="button"
                  onClick={() => navigate('/employee-list')}
                  className="px-6 h-12 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PersonaLearnLayout>
  );
}
