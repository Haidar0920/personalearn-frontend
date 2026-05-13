import { type ReactNode, useState, useEffect } from 'react';
import UserSidebar from './UserSidebar.tsx';
import Icon from '../components/Icon.tsx';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.tsx';
import { ToastContainer } from 'react-toastify';
import { supabase } from '../lib/supabase.ts';

interface PersonaLearnLayoutProps {
  children: ReactNode;
  title?: string;
  showSearch?: boolean;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export default function PersonaLearnLayout({ children }: PersonaLearnLayoutProps) {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const r = (session?.user?.app_metadata?.role as string) ?? null;
      setRole(r);

      if (session?.user) {
        const fullName = (session.user.user_metadata?.full_name as string) ?? '';
        const email = session.user.email ?? '';
        const parts = fullName.trim().split(' ');
        setUser({
          firstName: parts[0] ?? email.split('@')[0],
          lastName: parts.slice(1).join(' ') || ' ',
          email,
        });
      }
    });
  }, []);

  const roleLabel =
    role === 'client_admin'
      ? 'Руководитель'
      : role === 'client_user'
      ? 'Сотрудник'
      : 'Пользователь';

  return (
    <div className="flex h-screen overflow-hidden bg-background-light font-display text-slate-900">
      {role === 'client_admin' ? <AdminSidebar /> : <UserSidebar />}
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50/50">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 ps-8 pe-4 flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-3">
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              onClick={() => navigate('/notifications')}
            >
              <Icon name="notifications" className="text-[20px]" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-3 p-2">
              <span className="flex gap-3 cursor-pointer" onClick={() => navigate('/setting')}>
                <div
                  className="size-9 rounded-full bg-slate-200 bg-cover bg-center border border-slate-200 shadow-sm"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9_gI4z1AeI_SeVngeRHxh2ncUZtPfPr09J0CYW2S3Ym0XbD6GWaTM6oB2GuOAeSg3kLD-ZCehpHk_4iiAAnnRR3jQeZjW88-GVKEM_9VfYJAnzFxREnYY9HXZbfyO5wJmfjm5anGLGGei590ay58H-rEIRtx7KEyz8C92s__leWLbOWvcCe6kq3s0r90PjIP0VzQOcVOd3luF1iuPRSbkYa-W-lKUQhHyhcHm7k4Zs-GBTem2NPi-ZWJe_tidHpxaxtQZCRh79zQ')",
                  }}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {user?.firstName} {user?.lastName ? user.lastName[0] + '.' : ''}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate font-medium">{roleLabel}</p>
                </div>
              </span>
              <button
                className="text-slate-400 hover:text-slate-600 transition-colors"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/login');
                }}
              >
                <Icon name="logout" className="text-lg" />
              </button>
            </div>
          </div>
        </header>
        <div className="space-y-8">{children}</div>
      </main>
    </div>
  );
}
