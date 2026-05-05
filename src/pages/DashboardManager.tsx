import PersonaLearnLayout from '../layouts/PersonaLearnLayout';
import KPICard from '../components/KPICard';
import ProgressChart from '../components/ProgressChart';
import MasteryChart from '../components/MasteryChart';
import QuickActionCard from '../components/QuickActionCard';
import dashboardData from '../data/dashboard2.json';
import {useEffect} from "react";
import {getRoleFromToken} from "../services/getRoleFromToken.ts";
import {useNavigate} from "react-router-dom";

export default function DashboardManager() {

    const role = getRoleFromToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (role != "client_admin") {
            navigate("/dashboard");
        }
    }, [role]);

    return (
        <PersonaLearnLayout>
            <div className="space-y-8 m-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardData.kpis.map((kpi, index) => (
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
