import {createBrowserRouter} from 'react-router-dom';
import Login from '../pages/Login';
import DashboardManager from '../pages/DashboardManager';
import EmployeeList from '../pages/EmployeeList';
import TrainingMaterials from '../pages/TrainingMaterials';
import SystemSettings from '../pages/SystemSettings';
import AnalyticsAdmin from '../pages/./AnalyticsAdmin';
import EmployeeTraining from '../pages/EmployeeTraining';
import AIHelper from "../pages/AIHelper.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import NotFound from "../pages/NotFound.tsx";
import AccessDenied from "../pages/AccessDenied.tsx";
import EmployeeProfile from "../pages/EmployeeProfile.tsx";
import DashboardUser from "../pages/DashboardUser.tsx";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login/>,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute allow={["client_admin", "client_user"]}>
                <DashboardManager/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute allow={["client_admin", "client_user"]}>
                <DashboardUser/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/employee-list',
        element: (
            <ProtectedRoute allow={["client_admin"]}>
                <EmployeeList/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/employee/:id',
        element: (
            <ProtectedRoute allow={["client_admin"]}>
                <EmployeeProfile/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/training-materials',
        element: (
            <ProtectedRoute allow={["client_admin", "client_user"]}>
                <TrainingMaterials/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/setting',
        element: (
            <ProtectedRoute allow={["client_admin", "client_user"]}>
                <SystemSettings/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/analytics-admin',
        element: (
            <ProtectedRoute allow={["client_admin"]}>
                <AnalyticsAdmin/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/training',
        element: (
            <ProtectedRoute allow={["client_admin", "client_user"]}>
                <EmployeeTraining/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/ai-helper',
        element: (
            <ProtectedRoute allow={["client_admin", "client_user"]}>
                <AIHelper/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/access-denied',
        element: (
            <AccessDenied/>
        ),
    },
    {
        path: '*',
        element: <NotFound/>,
    },
]);

export default router;
